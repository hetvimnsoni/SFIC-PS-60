-- ==============================================================================
-- ShikshaSetu AI - Performance Indexes (002_add_indexes.sql)
-- Optimizes gap detection, classroom report generation, and student timeline queries
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_students_classroom ON students(classroom_id);
CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
CREATE INDEX IF NOT EXISTS idx_assessment_results_student ON assessment_results(student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_concept ON assessment_results(concept_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_composite ON assessment_results(student_id, concept_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_learning_gaps_student ON learning_gaps(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_gaps_priority ON learning_gaps(priority);
CREATE INDEX IF NOT EXISTS idx_learning_gaps_status ON learning_gaps(status);
CREATE INDEX IF NOT EXISTS idx_remedial_plans_student ON remedial_plans(student_id);
CREATE INDEX IF NOT EXISTS idx_remedial_plans_status ON remedial_plans(status);
CREATE INDEX IF NOT EXISTS idx_activity_attempts_student ON activity_attempts(student_id);
