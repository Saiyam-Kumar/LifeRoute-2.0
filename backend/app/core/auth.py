from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth


# Swagger/OpenAPI Bearer authentication scheme
bearer_scheme = HTTPBearer(
    auto_error=False,
)


def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials | None = Security(
        bearer_scheme
    ),
):
    """
    Verify a Firebase ID token sent as:

    Authorization: Bearer <firebase_id_token>
    """

    if credentials is None:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is required",
        )

    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Authorization header must use Bearer token",
        )

    id_token = credentials.credentials.strip()

    if not id_token:
        raise HTTPException(
            status_code=401,
            detail="Firebase ID token is missing",
        )

    try:
        decoded_token = auth.verify_id_token(id_token)

        return decoded_token

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Firebase ID token",
        )