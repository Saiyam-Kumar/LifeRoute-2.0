from app.database.firebase import db


DEFAULT_RESOURCES = [
    "Emergency Department",
    "ICU",
    "Oxygen",
    "ECG",
    "Ventilator",
    "Emergency Physician",
    "Cardiologist",
    "Radiology",
    "Laboratory",
    "Pharmacy",
]


HOSPITALS = [
    # =========================
    # DELHI / NCR
    # =========================
    {
        "id": "aiims_new_delhi",
        "name": "AIIMS New Delhi",
        "latitude": 28.5672,
        "longitude": 77.2100,
        "address": "Ansari Nagar, New Delhi, Delhi 110029",
        "phone": "011-26588500",
        "emergency_department": "24/7 Emergency",
        "available_beds": 120,
        "available_icu": 20,
        "ventilators": 15,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon", "Neurosurgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre", "Blood Bank"],
        "hospital_type": "Government Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "apollo_delhi",
        "name": "Apollo Hospitals Delhi",
        "latitude": 28.5355,
        "longitude": 77.2820,
        "address": "NH-19, Jasola Vihar, New Delhi, Delhi 110020",
        "phone": "08069049768",
        "emergency_department": "24/7 Emergency",
        "available_beds": 100,
        "available_icu": 18,
        "ventilators": 12,
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "fortis_escorts_delhi",
        "name": "Fortis Escorts Heart Institute",
        "latitude": 28.5580,
        "longitude": 77.2730,
        "address": "Okhla Road, New Delhi, Delhi 110025",
        "phone": "011-47135000",
        "emergency_department": "24/7 Emergency",
        "available_beds": 80,
        "available_icu": 15,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Cardiac Surgeon", "Emergency Physician"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Cardiac ICU"],
        "hospital_type": "Private Super-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # GURUGRAM / NOIDA
    # =========================
    {
        "id": "medanta_gurugram",
        "name": "Medanta - The Medicity",
        "latitude": 28.4389,
        "longitude": 77.0405,
        "address": "Sector 38, Gurugram, Haryana 122001",
        "phone": "0124-4141414",
        "emergency_department": "24/7 Emergency",
        "available_beds": 150,
        "available_icu": 30,
        "ventilators": 20,
        "specialists": ["Cardiologist", "Neurologist", "Neurosurgeon", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre", "Cardiac ICU"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "fortis_noida",
        "name": "Fortis Hospital Noida",
        "latitude": 28.5708,
        "longitude": 77.3272,
        "address": "B-22, Sector 62, Noida, Uttar Pradesh 201301",
        "phone": "0120-4303333",
        "emergency_department": "24/7 Emergency",
        "available_beds": 70,
        "available_icu": 14,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # MUMBAI
    # =========================
    {
        "id": "kokilaben_mumbai",
        "name": "Kokilaben Dhirubhai Ambani Hospital",
        "latitude": 19.1317,
        "longitude": 72.8258,
        "address": "Four Bungalows, Andheri West, Mumbai, Maharashtra 400053",
        "phone": "022-42696969",
        "emergency_department": "24/7 Emergency",
        "available_beds": 120,
        "available_icu": 25,
        "ventilators": 15,
        "specialists": ["Cardiologist", "Neurologist", "Neurosurgeon", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre", "Cardiac ICU"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "nanavati_max_mumbai",
        "name": "Nanavati Max Super Speciality Hospital",
        "latitude": 19.0980,
        "longitude": 72.8397,
        "address": "SV Road, Vile Parle West, Mumbai, Maharashtra 400056",
        "phone": "022-26267500",
        "emergency_department": "24/7 Emergency",
        "available_beds": 100,
        "available_icu": 20,
        "ventilators": 12,
        "specialists": ["Cardiologist", "Neurologist", "Oncologist"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "apollo_navi_mumbai",
        "name": "Apollo Hospitals Navi Mumbai",
        "latitude": 19.0178,
        "longitude": 73.0390,
        "address": "Parsik Hill Road, CBD Belapur, Navi Mumbai, Maharashtra 400614",
        "phone": "08062972766",
        "emergency_department": "24/7 Emergency",
        "available_beds": 90,
        "available_icu": 18,
        "ventilators": 12,
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # PUNE
    # =========================
    {
        "id": "apollo_pune",
        "name": "Apollo Hospitals Pune",
        "latitude": 18.5018,
        "longitude": 73.8640,
        "address": "Shankar Sheth Road, Pune, Maharashtra 411042",
        "phone": "08062972814",
        "emergency_department": "24/7 Emergency",
        "available_beds": 75,
        "available_icu": 15,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # BENGALURU
    # =========================
    {
        "id": "manipal_old_airport",
        "name": "Manipal Hospital Old Airport Road",
        "latitude": 12.9600,
        "longitude": 77.6480,
        "address": "98, HAL Airport Road, Bengaluru, Karnataka 560017",
        "phone": "080-25023333",
        "emergency_department": "24/7 Emergency",
        "available_beds": 110,
        "available_icu": 22,
        "ventilators": 14,
        "specialists": ["Cardiologist", "Neurologist", "Neurosurgeon", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre", "Cardiac ICU"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "fortis_bg_road_bangalore",
        "name": "Fortis Hospital BG Road Bangalore",
        "latitude": 12.8975,
        "longitude": 77.5975,
        "address": "Bannerghatta Road, Bengaluru, Karnataka",
        "phone": "080-66214444",
        "emergency_department": "24/7 Emergency",
        "available_beds": 85,
        "available_icu": 16,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "apollo_jayanagar",
        "name": "Apollo Speciality Hospital Jayanagar",
        "latitude": 12.9279,
        "longitude": 77.5834,
        "address": "Jayanagar, Bengaluru, Karnataka 560011",
        "phone": "08062972760",
        "emergency_department": "24/7 Emergency",
        "available_beds": 60,
        "available_icu": 12,
        "ventilators": 8,
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"],
        "resources": DEFAULT_RESOURCES,
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 2",
        "is_open": True,
    },

    # =========================
    # CHENNAI
    # =========================
    {
        "id": "apollo_greams_chennai",
        "name": "Apollo Hospitals Greams Road",
        "latitude": 13.0627,
        "longitude": 80.2527,
        "address": "21 Greams Road, Chennai, Tamil Nadu 600006",
        "phone": "08069049756",
        "emergency_department": "24/7 Emergency",
        "available_beds": 120,
        "available_icu": 25,
        "ventilators": 16,
        "specialists": ["Cardiologist", "Neurologist", "Neurosurgeon", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre", "Cardiac ICU"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "fortis_chennai",
        "name": "Fortis Hospital Chennai",
        "latitude": 12.9020,
        "longitude": 80.2270,
        "address": "Perumbakkam, Chennai, Tamil Nadu",
        "phone": "044-71777777",
        "emergency_department": "24/7 Emergency",
        "available_beds": 75,
        "available_icu": 15,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # HYDERABAD
    # =========================
    {
        "id": "apollo_health_city_hyderabad",
        "name": "Apollo Health City Hyderabad",
        "latitude": 17.4156,
        "longitude": 78.4119,
        "address": "Road No. 72, Jubilee Hills, Hyderabad, Telangana 500033",
        "phone": "04023607777",
        "emergency_department": "24/7 Emergency",
        "available_beds": 130,
        "available_icu": 25,
        "ventilators": 16,
        "specialists": ["Cardiologist", "Neurologist", "Neurosurgeon", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre", "Cardiac ICU"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "yashoda_secunderabad",
        "name": "Yashoda Hospitals Secunderabad",
        "latitude": 17.4399,
        "longitude": 78.4983,
        "address": "Alexander Road, Secunderabad, Telangana 500003",
        "phone": "04045674567",
        "emergency_department": "24/7 Emergency",
        "available_beds": 100,
        "available_icu": 20,
        "ventilators": 12,
        "specialists": ["Cardiologist", "Neurologist", "Neurosurgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # KOLKATA
    # =========================
    {
        "id": "apollo_multispeciality_kolkata",
        "name": "Apollo Multispeciality Hospitals Kolkata",
        "latitude": 22.5736,
        "longitude": 88.4004,
        "address": "58 Canal Circular Road, Kolkata, West Bengal 700054",
        "phone": "08062972764",
        "emergency_department": "24/7 Emergency",
        "available_beds": 100,
        "available_icu": 20,
        "ventilators": 12,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "fortis_anandapur_kolkata",
        "name": "Fortis Hospital Anandapur Kolkata",
        "latitude": 22.5125,
        "longitude": 88.4250,
        "address": "730 Anandapur, Kolkata, West Bengal 700107",
        "phone": "03366284444",
        "emergency_department": "24/7 Emergency",
        "available_beds": 80,
        "available_icu": 16,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # AHMEDABAD
    # =========================
    {
        "id": "apollo_ahmedabad",
        "name": "Apollo Hospitals Ahmedabad",
        "latitude": 23.0710,
        "longitude": 72.5150,
        "address": "Gandhinagar Highway, Ahmedabad, Gujarat",
        "phone": "07966701800",
        "emergency_department": "24/7 Emergency",
        "available_beds": 90,
        "available_icu": 18,
        "ventilators": 12,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # JAIPUR
    # =========================
    {
        "id": "fortis_jaipur",
        "name": "Fortis Escorts Hospital Jaipur",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "address": "Malviya Nagar, Jaipur, Rajasthan",
        "phone": "0141-2547000",
        "emergency_department": "24/7 Emergency",
        "available_beds": 80,
        "available_icu": 16,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # LUCKNOW
    # =========================
    {
        "id": "apollo_lucknow",
        "name": "Apollo Hospitals Lucknow",
        "latitude": 26.7957,
        "longitude": 80.8957,
        "address": "Kanpur-Lucknow Road, LDA Colony, Lucknow, Uttar Pradesh 226012",
        "phone": "05226788888",
        "emergency_department": "24/7 Emergency",
        "available_beds": 85,
        "available_icu": 16,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "max_lucknow",
        "name": "Max Super Speciality Hospital Lucknow",
        "latitude": 26.8467,
        "longitude": 80.9462,
        "address": "Lucknow, Uttar Pradesh",
        "phone": "05226780001",
        "emergency_department": "24/7 Emergency",
        "available_beds": 75,
        "available_icu": 15,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Neurosurgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre"],
        "hospital_type": "Private Super-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # MOHALI / CHANDIGARH
    # =========================
    {
        "id": "fortis_mohali",
        "name": "Fortis Hospital Mohali",
        "latitude": 30.6948,
        "longitude": 76.7313,
        "address": "Phase 8, Mohali, Punjab 160062",
        "phone": "+91 172 469 2222",
        "emergency_department": "24/7 Emergency",
        "available_beds": 90,
        "available_icu": 18,
        "ventilators": 12,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre", "Cardiac ICU"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "max_mohali",
        "name": "Max Super Speciality Hospital Mohali",
        "latitude": 30.7046,
        "longitude": 76.7179,
        "address": "Mohali, Punjab",
        "phone": "7710777107",
        "emergency_department": "24/7 Emergency",
        "available_beds": 80,
        "available_icu": 16,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # BHUBANESWAR
    # =========================
    {
        "id": "apollo_bhubaneswar",
        "name": "Apollo Hospitals Bhubaneswar",
        "latitude": 20.2961,
        "longitude": 85.8245,
        "address": "Sainik School Road, Bhubaneswar, Odisha 751005",
        "phone": "08069049752",
        "emergency_department": "24/7 Emergency",
        "available_beds": 75,
        "available_icu": 15,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
    {
        "id": "max_bhubaneswar",
        "name": "Max Super Speciality Hospital Bhubaneswar",
        "latitude": 20.3268,
        "longitude": 85.8187,
        "address": "Maitri Vihar, Bhubaneswar, Odisha 751023",
        "phone": "18005724000",
        "emergency_department": "24/7 Emergency",
        "available_beds": 70,
        "available_icu": 14,
        "ventilators": 9,
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # VISAKHAPATNAM
    # =========================
    {
        "id": "apollo_visakhapatnam",
        "name": "Apollo Hospitals Health City Visakhapatnam",
        "latitude": 17.7473,
        "longitude": 83.2930,
        "address": "Arilova, Visakhapatnam, Andhra Pradesh 530040",
        "phone": "08912867777",
        "emergency_department": "24/7 Emergency",
        "available_beds": 75,
        "available_icu": 15,
        "ventilators": 10,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # GUWAHATI
    # =========================
    {
        "id": "apollo_guwahati",
        "name": "Apollo Hospitals Guwahati",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "address": "Christian Basti, G S Road, Guwahati, Assam 781005",
        "phone": "08062972762",
        "emergency_department": "24/7 Emergency",
        "available_beds": 65,
        "available_icu": 12,
        "ventilators": 8,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # INDORE
    # =========================
    {
        "id": "apollo_indore",
        "name": "Apollo Hospitals Indore",
        "latitude": 22.7533,
        "longitude": 75.8937,
        "address": "Scheme No. 74 C, Vijay Nagar, Indore, Madhya Pradesh 452010",
        "phone": "08069049755",
        "emergency_department": "24/7 Emergency",
        "available_beds": 70,
        "available_icu": 14,
        "ventilators": 9,
        "specialists": ["Cardiologist", "Neurologist", "Orthopedic Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

        # =========================
    # INDORE - ADDITIONAL HOSPITALS
    # =========================
    {
        "id": "bombay_hospital_indore",
        "name": "Bombay Hospital Indore",
        "latitude": 22.7447,
        "longitude": 75.8945,
        "address": "Eastern Ring Road, IDA Scheme No. 94/95, Tulsi Nagar, Indore, Madhya Pradesh 452010",
        "phone": "0731-4771111",
        "emergency_department": "24/7 Emergency",
        "available_beds": 120,
        "available_icu": 25,
        "ventilators": 15,
        "specialists": [
            "Cardiologist",
            "Neurologist",
            "Neurosurgeon",
            "Oncologist",
            "Orthopedic Surgeon",
            "General Surgeon"
        ],
        "resources": DEFAULT_RESOURCES + [
            "Cath Lab",
            "Trauma Centre",
            "Cardiac ICU",
            "Blood Bank",
            "CT Scan",
            "MRI"
        ],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    {
        "id": "choithram_hospital_indore",
        "name": "Choithram Hospital & Research Centre",
        "latitude": 22.7068,
        "longitude": 75.8512,
        "address": "Manik Bagh Road, Indore, Madhya Pradesh 452014",
        "phone": "0731-2362491",
        "emergency_department": "24/7 Emergency & Trauma",
        "available_beds": 100,
        "available_icu": 20,
        "ventilators": 12,
        "specialists": [
            "Cardiologist",
            "Neurologist",
            "Neurosurgeon",
            "General Surgeon",
            "Orthopedic Surgeon",
            "Emergency Physician"
        ],
        "resources": DEFAULT_RESOURCES + [
            "Trauma Centre",
            "Cardiac ICU",
            "Blood Bank",
            "Dialysis"
        ],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    {
        "id": "medanta_indore",
        "name": "Medanta Hospital Indore",
        "latitude": 22.7533,
        "longitude": 75.8937,
        "address": "Indore, Madhya Pradesh",
        "phone": "0731-4747000",
        "emergency_department": "24/7 Emergency",
        "available_beds": 80,
        "available_icu": 16,
        "ventilators": 10,
        "specialists": [
            "Cardiologist",
            "Neurologist",
            "Neurosurgeon",
            "Orthopedic Surgeon"
        ],
        "resources": DEFAULT_RESOURCES + [
            "Trauma Centre",
            "Cath Lab",
            "Cardiac ICU"
        ],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    {
        "id": "choithram_netralaya_indore",
        "name": "Choithram Netralaya Indore",
        "latitude": 22.7065,
        "longitude": 75.8508,
        "address": "Manik Bagh Road, Indore, Madhya Pradesh",
        "phone": "0731-2362491",
        "emergency_department": "Emergency Services",
        "available_beds": 30,
        "available_icu": 4,
        "ventilators": 2,
        "specialists": [
            "Ophthalmologist",
            "Ophthalmic Surgeon"
        ],
        "resources": [
            "Emergency Department",
            "ECG",
            "Laboratory",
            "Pharmacy",
            "Ophthalmology",
            "Operation Theatre"
        ],
        "hospital_type": "Speciality Hospital",
        "emergency_level": "Level 2",
        "is_open": True,
    },

    {
        "id": "care_chl_indore",
        "name": "CARE CHL Hospitals Indore",
        "latitude": 22.7244,
        "longitude": 75.8839,
        "address": "AB Road, Indore, Madhya Pradesh",
        "phone": "0731-4755555",
        "emergency_department": "24/7 Emergency",
        "available_beds": 70,
        "available_icu": 14,
        "ventilators": 9,
        "specialists": [
            "Cardiologist",
            "Neurologist",
            "Orthopedic Surgeon",
            "General Surgeon"
        ],
        "resources": DEFAULT_RESOURCES + [
            "Trauma Centre",
            "Cath Lab",
            "Cardiac ICU"
        ],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # BHOPAL
    # =========================
    {
        "id": "apollo_sage_bhopal",
        "name": "Apollo Sage Hospitals Bhopal",
        "latitude": 23.1765,
        "longitude": 77.4440,
        "address": "Bawadiya Kalan, Bhopal, Madhya Pradesh 462026",
        "phone": "08069049766",
        "emergency_department": "24/7 Emergency",
        "available_beds": 60,
        "available_icu": 12,
        "ventilators": 8,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 2",
        "is_open": True,
    },

    # =========================
    # NAGPUR
    # =========================
    {
        "id": "max_nagpur",
        "name": "Max Super Speciality Hospital Nagpur",
        "latitude": 21.1800,
        "longitude": 79.0880,
        "address": "Mankapur Square, Koradi Road, Nagpur, Maharashtra 440030",
        "phone": "07127120000",
        "emergency_department": "24/7 Emergency",
        "available_beds": 70,
        "available_icu": 14,
        "ventilators": 9,
        "specialists": ["Cardiologist", "Neurologist", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Trauma Centre"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # KOCHI
    # =========================
    {
        "id": "amrita_kochi",
        "name": "Amrita Hospital Kochi",
        "latitude": 10.0460,
        "longitude": 76.2910,
        "address": "Ponekkara, Kochi, Kerala",
        "phone": "04842800000",
        "emergency_department": "24/7 Emergency",
        "available_beds": 120,
        "available_icu": 24,
        "ventilators": 15,
        "specialists": ["Cardiologist", "Neurologist", "Neurosurgeon", "Trauma Surgeon"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Trauma Centre", "Cardiac ICU"],
        "hospital_type": "Private Multi-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },

    # =========================
    # HYDERABAD / CHENNAI / SOUTH
    # =========================
    {
        "id": "narayana_bangalore",
        "name": "Narayana Institute of Cardiac Sciences",
        "latitude": 12.8955,
        "longitude": 77.6010,
        "address": "Bommasandra, Bengaluru, Karnataka",
        "phone": "08071222222",
        "emergency_department": "24/7 Emergency",
        "available_beds": 100,
        "available_icu": 20,
        "ventilators": 14,
        "specialists": ["Cardiologist", "Cardiac Surgeon", "Emergency Physician"],
        "resources": DEFAULT_RESOURCES + ["Cath Lab", "Cardiac ICU"],
        "hospital_type": "Private Super-Speciality",
        "emergency_level": "Level 1",
        "is_open": True,
    },
]


def seed_hospitals():
    collection = db.collection("hospitals")

    created = 0
    skipped = 0

    for hospital in HOSPITALS:
        hospital_id = hospital["id"]

        # Never overwrite an existing hospital.
        doc_ref = collection.document(hospital_id)
        existing = doc_ref.get()

        if existing.exists:
            print(f"SKIPPED: {hospital['name']}")
            skipped += 1
            continue

        data = {key: value for key, value in hospital.items() if key != "id"}

        doc_ref.set(data)

        print(f"ADDED: {hospital['name']}")
        created += 1

    print("\n================================")
    print("LifeRoute 2.0 Hospital Seed")
    print("================================")
    print(f"Added   : {created}")
    print(f"Skipped : {skipped}")
    print(f"Total dataset: {len(HOSPITALS)}")


if __name__ == "__main__":
    seed_hospitals()