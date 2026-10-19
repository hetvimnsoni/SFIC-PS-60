-- ==============================================================================
-- ShikshaSetu AI - Seed SQL Data (001_seed_data.sql)
-- Seeds initial Gujarat primary school, classrooms, subjects, concepts & students
-- ==============================================================================

-- 1. School & Settings
INSERT INTO schools (id, name, code, preferred_language)
VALUES ('sch-gn-01', 'Model Primary School, Gandhinagar', 'GUJ-GNR-042', 'en')
ON CONFLICT (id) DO NOTHING;

INSERT INTO school_settings (id, school_id, mastery_threshold, developing_threshold, preferred_language, enable_ai_assist)
VALUES ('set-01', 'sch-gn-01', 80, 60, 'en', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Classrooms
INSERT INTO classrooms (id, school_id, grade, section, academic_year) VALUES
('cls-3a', 'sch-gn-01', 3, 'A', '2026-27'),
('cls-4a', 'sch-gn-01', 4, 'A', '2026-27'),
('cls-5a', 'sch-gn-01', 5, 'A', '2026-27')
ON CONFLICT (id) DO NOTHING;

-- 3. Subjects
INSERT INTO subjects (id, name, name_gujarati, code, language_code) VALUES
('sub-math', 'Mathematics', 'ગણિત', 'MATH', 'en'),
('sub-eng', 'English', 'અંગ્રેજી', 'ENG', 'en'),
('sub-guj', 'Gujarati', 'ગુજરાતી', 'GUJ', 'gu'),
('sub-evs', 'Environmental Studies', 'પર્યાવરણ', 'EVS', 'en')
ON CONFLICT (id) DO NOTHING;

-- 4. Key Concepts
INSERT INTO concepts (id, subject_id, subject_code, grade, name, name_gujarati, description) VALUES
('c-div-01', 'sub-math', 'MATH', 4, 'Division Basics & Equal Sharing', 'ભાગાકારની મૂળભૂત સંકલ્પના અને સરખા ભાગ', 'Understanding division as the inverse of multiplication, equal grouping, and repeated subtraction.'),
('c-mult-01', 'sub-math', 'MATH', 3, 'Multiplication as Repeated Addition', 'પુનરાવર્તિત સરવાળા તરીકે ગુણાકાર', 'Connecting repeated grouping to times tables.'),
('c-frac-01', 'sub-math', 'MATH', 4, 'Fractions as Part of a Whole', 'સમગ્રના ભાગ તરીકે અપૂર્ણાંક', 'Identifying halves, thirds, and quarters in geometric shapes.')
ON CONFLICT (id) DO NOTHING;

-- 5. Key Students
INSERT INTO students (id, student_code, display_name, classroom_id, grade, section, enrollment_status, notes) VALUES
('std-aarav', 'MPS-26-401', 'Aarav Patel', 'cls-4a', 4, 'A', 'active', 'Kinesthetic learner; benefits from physical manipulatives and token distribution.'),
('std-diya', 'MPS-26-402', 'Diya Shah', 'cls-4a', 4, 'A', 'active', 'High verbal ability; struggles with mathematical step-by-step sequencing.'),
('std-kabir', 'MPS-26-403', 'Kabir Varma', 'cls-4a', 4, 'A', 'active', 'Mastered foundational addition and multiplication; excelling in class.')
ON CONFLICT (id) DO NOTHING;
