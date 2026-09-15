import re

from firebase_admin import auth

from app.database.firebase import db


COMMON_PASSWORD = "LifeRoute@123"
HOSPITAL_COLLECTION = "hospitals"
EMAIL_DOMAIN = "liferoute.demo"


def make_login_email(hospital_id: str) -> str:
    """
    Convert an existing Firestore hospital ID into
    a Firebase-login-friendly email address.
    """

    local_part = hospital_id.lower().strip()

    local_part = re.sub(
        r"[^a-z0-9._%+-]",
        "_",
        local_part,
    )

    return f"{local_part}@{EMAIL_DOMAIN}"


def get_or_create_user(email: str, hospital_name: str):
    """
    Find an existing Firebase Auth user by email.
    If it doesn't exist, create one.

    In both cases, enforce the common demo password.
    """

    try:
        user = auth.get_user_by_email(email)

        # Existing user:
        # update password so all hospital accounts
        # use the same demo password.
        user = auth.update_user(
            user.uid,
            password=COMMON_PASSWORD,
            display_name=hospital_name,
        )

        return user, False

    except auth.UserNotFoundError:

        user = auth.create_user(
            email=email,
            password=COMMON_PASSWORD,
            display_name=hospital_name,
            email_verified=True,
        )

        return user, True


def main():
    print()
    print("=" * 70)
    print("LifeRoute Hospital Authentication Setup")
    print("=" * 70)
    print()

    hospitals = list(
        db.collection(HOSPITAL_COLLECTION).stream()
    )

    if not hospitals:
        print("No hospitals found in Firestore.")
        return

    print(
        f"Found {len(hospitals)} hospital(s) in Firestore."
    )
    print()

    results = []

    for doc in hospitals:
        hospital = doc.to_dict()

        hospital_id = doc.id

        hospital_name = (
            hospital.get("name")
            or hospital_id
        )

        print("-" * 70)
        print(f"Hospital : {hospital_name}")
        print(f"ID       : {hospital_id}")

        try:
            existing_uid = hospital.get(
                "firebase_uid"
            )

            # --------------------------------------------------
            # If this hospital is already linked to Firebase
            # Authentication, reuse that account.
            # --------------------------------------------------

            if existing_uid:
                try:
                    user = auth.get_user(
                        existing_uid
                    )

                    user = auth.update_user(
                        user.uid,
                        password=COMMON_PASSWORD,
                        display_name=hospital_name,
                    )

                    created = False

                    print(
                        "Auth     : Existing linked account reused"
                    )

                except auth.UserNotFoundError:
                    print(
                        "Warning  : Existing firebase_uid is invalid."
                    )

                    login_email = make_login_email(
                        hospital_id
                    )

                    user, created = get_or_create_user(
                        login_email,
                        hospital_name,
                    )

            else:
                # --------------------------------------------------
                # No Firebase UID yet.
                # Create/reuse account using deterministic email.
                # --------------------------------------------------

                login_email = make_login_email(
                    hospital_id
                )

                user, created = get_or_create_user(
                    login_email,
                    hospital_name,
                )

            # --------------------------------------------------
            # Add ONLY firebase_uid to the existing hospital doc.
            # All existing hospital fields remain untouched.
            # --------------------------------------------------

            doc.reference.update(
                {
                    "firebase_uid": user.uid
                }
            )

            # Get actual email from Firebase Auth.
            login_email = user.email

            results.append(
                {
                    "hospital": hospital_name,
                    "hospital_id": hospital_id,
                    "email": login_email,
                    "uid": user.uid,
                    "created": created,
                }
            )

            print(
                f"Email    : {login_email}"
            )
            print(
                f"UID      : {user.uid}"
            )
            print(
                f"Password : {COMMON_PASSWORD}"
            )

            if created:
                print("Status   : CREATED")
            else:
                print("Status   : EXISTING / UPDATED")

        except Exception as error:
            print(
                f"ERROR    : {error}"
            )

    # ----------------------------------------------------------
    # Final login list
    # ----------------------------------------------------------

    print()
    print("=" * 70)
    print("HOSPITAL LOGIN LIST")
    print("=" * 70)
    print()

    for result in results:
        print(
            f"{result['hospital']}"
        )
        print(
            f"  Hospital ID : {result['hospital_id']}"
        )
        print(
            f"  Login Email : {result['email']}"
        )
        print(
            f"  Password    : {COMMON_PASSWORD}"
        )
        print()

    print("=" * 70)
    print(
        f"Completed: {len(results)} hospital(s)"
    )
    print("=" * 70)
    print()


if __name__ == "__main__":
    main()