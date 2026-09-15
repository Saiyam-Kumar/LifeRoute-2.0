def calculate_resource_match(patient_resources, hospital):
    matched = []

    for resource in patient_resources:

        if resource == "ICU":
            if hospital.get("available_icu", 0) > 0:
                matched.append(resource)

        elif resource == "Ventilator":
            if hospital.get("ventilators", 0) > 0:
                matched.append(resource)

        elif resource in hospital.get("specialists", []):
            matched.append(resource)

        elif resource in hospital.get("resources", []):
            matched.append(resource)

    score = 0

    if patient_resources:
        score = (len(matched) / len(patient_resources)) * 100

    return score, matched


def calculate_eta_score(hospital):
    eta = hospital.get("eta")

    if eta is None:
        return 0

    # Faster hospital = higher score
    return max(0, 100 - eta * 2)


def calculate_open_score(hospital):
    return 100 if hospital.get("is_open", False) else 0


def recommend_hospital(patient_resources, hospitals):

    if not hospitals:
        return None

    ranked = []

    for hospital in hospitals:

        resource_score, matched = calculate_resource_match(
            patient_resources,
            hospital
        )

        missing = [
            resource
            for resource in patient_resources
            if resource not in matched
        ]

        # --------------------------------------------------
        # CRITICAL RULE:
        # Prefer hospitals that have ALL required resources.
        # --------------------------------------------------

        complete_match = len(missing) == 0

        eta_score = calculate_eta_score(hospital)
        open_score = calculate_open_score(hospital)

        # Resource availability is the most important factor.
        final_score = (
            resource_score * 0.70
            + eta_score * 0.25
            + open_score * 0.05
        )

        # A hospital missing a required resource should NOT
        # beat a hospital that has everything.
        if not complete_match:
            final_score *= 0.50

        ranked.append({
            "id": hospital["id"],
            "hospital": hospital["name"],
            "score": round(final_score, 2),

            "latitude": hospital.get("latitude"),
            "longitude": hospital.get("longitude"),

            "matched_resources": matched,

            "missing_resources": missing,

            "eta": hospital.get("eta"),
            "distance_km": hospital.get("distance_km"),

            "phone": hospital.get("phone"),
            "address": hospital.get("address"),

            "emergency_department": hospital.get(
                "emergency_department",
                "Emergency Department"
            ),

            "_complete_match": complete_match,
            "_resource_score": resource_score,
        })

    # --------------------------------------------------
    # FIRST PRIORITY:
    # Hospitals with ALL required resources.
    #
    # SECOND PRIORITY:
    # Score.
    # --------------------------------------------------

    ranked.sort(
        key=lambda hospital: (
            hospital["_complete_match"],
            hospital["score"],
        ),
        reverse=True,
    )

    best_hospital = ranked[0]

    # Remove internal fields before returning
    best_hospital.pop("_complete_match", None)
    best_hospital.pop("_resource_score", None)

    return best_hospital