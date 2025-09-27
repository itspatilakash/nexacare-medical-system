# Future Schema Enhancements

## Suggested Additional Fields for Medical System Tables

### 👨‍⚕️ DOCTORS TABLE - Additional Fields

#### Professional Information
```sql
medical_council_registration varchar(50) -- MCI/DMC registration number
registration_validity_date date
specialization_subcategories text[] -- [Cardiology, Interventional Cardiology]
fellowship_certifications text
continuing_medical_education_hours integer
publications_count integer
```

#### Practice Details  
```sql
consultation_duration_minutes integer default(30)
follow_up_consultation_fee decimal(10,2)
telemedicine_available boolean default(false)
home_visit_available boolean default(false)
emergency_consultation_fee decimal(10,2)
```

#### Availability & Scheduling
```sql
weekly_schedule jsonb -- Detailed weekly schedule
holiday_schedule jsonb -- Planned holidays/leave
max_patients_per_day integer
buffer_time_minutes integer default(5)
```

#### Contact & Communication
```sql
alternative_phone varchar(20)
whatsapp_number varchar(20)
video_consultation_platform varchar(50)
preferred_communication_method varchar(20)
```

#### Verification & Compliance
```sql
documents_uploaded jsonb -- License, certificates, etc.
background_verification_status varchar(20)
malpractice_insurance_number varchar(50)
insurance_validity_date date
```

#### Performance & Reviews
```sql
average_rating decimal(3,2)
total_reviews integer default(0)
response_time_minutes integer
```

---

### 🏥 HOSPITALS TABLE - Additional Fields

#### Regulatory & Legal
```sql
hospital_registration_number varchar(50)
nabh_accreditation boolean -- National Accreditation Board for Hospitals
nabl_accreditation boolean -- National Accreditation Board for Testing
iso_certification varchar(20)
gst_number varchar(20)
pan_number varchar(20)
tax_registration_number varchar(50)
```

#### Infrastructure & Facilities
```sql
icu_beds integer
nicu_beds integer -- Neonatal ICU
operation_theaters integer
ambulance_count integer
pharmacy_available boolean
cafeteria_available boolean
parking_capacity integer
wheelchair_accessible boolean
```

#### Medical Services
```sql
blood_bank_available boolean
dialysis_center boolean
radiology_department boolean
pathology_lab boolean
pharmacy_24x7 boolean
emergency_trauma_center boolean
organ_transplant_services boolean
```

#### Contact & Communication
```sql
emergency_contact varchar(20)
ambulance_contact varchar(20)
admin_contact varchar(20)
billing_contact varchar(20)
social_media_links jsonb
```

#### Financial & Insurance
```sql
insurance_networks text[] -- [ICICI Lombard, Bajaj Allianz]
cashless_facility boolean
payment_methods text[] -- [Cash, Card, UPI, Insurance]
consultation_fee_range varchar(50)
```

#### Quality & Compliance
```sql
quality_ratings jsonb
complaint_resolution_time_hours integer
patient_satisfaction_score decimal(3,2)
```

---

### 👤 PATIENTS TABLE - Additional Fields

#### Personal Information
```sql
profile_picture_url varchar(255)
alternative_email varchar(255)
preferred_language varchar(20)
religion varchar(50)
nationality varchar(50)
aadhaar_number varchar(20) -- Indian ID
pan_number varchar(20)
```

#### Family & Emergency
```sql
family_doctor_name varchar(100)
family_doctor_contact varchar(20)
family_members jsonb -- Family member details
emergency_contact_2 varchar(20)
emergency_contact_2_name varchar(100)
emergency_contact_2_relation varchar(50)
```

#### Medical Information
```sql
vaccination_history jsonb
surgical_history jsonb
family_medical_history text
disability_status boolean
disability_type varchar(100)
organ_donor_status boolean
```

#### Insurance & Financial
```sql
insurance_policy_number varchar(50)
insurance_validity_date date
preferred_payment_method varchar(20)
financial_assistance_required boolean
government_health_scheme varchar(100) -- Ayushman Bharat, etc.
```

#### Communication Preferences
```sql
sms_notifications boolean default(true)
email_notifications boolean default(true)
whatsapp_notifications boolean default(true)
preferred_appointment_time varchar(20) -- Morning, Afternoon, Evening
preferred_communication_method varchar(20)
```

---

### 🧪 LABS TABLE - Additional Fields

#### Regulatory & Certification
```sql
nabl_certification_number varchar(50)
nabl_validity_date date
iso_15189_certification boolean
quality_control_protocols text
external_quality_assessment boolean
```

#### Test Services
```sql
home_sample_collection boolean
sample_collection_radius_km integer
report_delivery_methods text[] -- [Email, WhatsApp, Physical]
express_test_services boolean
bulk_testing_available boolean
```

#### Equipment & Technology
```sql
automated_equipment_list text[]
manual_testing_capability boolean
digital_reporting_system boolean
integration_with_hospital_systems boolean
```

#### Pricing & Packages
```sql
test_packages jsonb -- Package deals
discount_offers jsonb
corporate_tie_ups jsonb
insurance_coverage text[]
```

#### Contact & Logistics
```sql
sample_collection_contact varchar(20)
report_delivery_contact varchar(20)
technical_support_contact varchar(20)
sample_transport_facility boolean
```

---

### 📞 RECEPTIONISTS TABLE - Additional Fields

#### Employee Information
```sql
designation varchar(50)
reporting_manager_id integer
salary_grade varchar(20)
employment_type varchar(20) -- Full-time, Part-time, Contract
probation_period_end_date date
```

#### Skills & Training
```sql
languages_spoken text[]
medical_terminology_training boolean
customer_service_training boolean
software_training_completed text[]
certifications text[]
```

#### Access & Permissions
```sql
appointment_booking_access boolean
patient_data_access boolean
billing_access boolean
report_generation_access boolean
admin_panel_access boolean
```

#### Performance & Reviews
```sql
performance_rating decimal(3,2)
patient_interaction_score decimal(3,2)
efficiency_metrics jsonb
training_requirements text[]
```

---

## Priority Recommendations

### High Priority (Add First):
1. **Doctors**: `medical_council_registration`, `telemedicine_available`, `weekly_schedule`
2. **Hospitals**: `nabh_accreditation`, `icu_beds`, `emergency_contact`, `insurance_networks`
3. **Patients**: `aadhaar_number`, `family_members`, `preferred_language`
4. **Labs**: `nabl_certification_number`, `home_sample_collection`, `test_packages`

### Medium Priority:
- Contact information enhancements
- Insurance and financial fields
- Performance and rating fields

### Low Priority:
- Advanced scheduling features
- Detailed compliance tracking
- Analytics and reporting fields

---

**Note**: These enhancements should be implemented after the core system is stable and the basic data seeding is complete.
