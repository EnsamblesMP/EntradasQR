CREATE OR REPLACE TRIGGER email_templates_updated_at_trigger
    BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trigger_sync_alumno_year
    BEFORE INSERT OR UPDATE OF grupo ON alumnos
    FOR EACH ROW EXECUTE FUNCTION sync_alumno_year();

CREATE OR REPLACE TRIGGER trigger_historial_entradas
    AFTER INSERT OR UPDATE OR DELETE ON entradas
    FOR EACH ROW EXECUTE FUNCTION registrar_historial_cambio();
CREATE OR REPLACE TRIGGER trigger_historial_alumnos
    AFTER INSERT OR UPDATE OR DELETE ON alumnos
    FOR EACH ROW EXECUTE FUNCTION registrar_historial_cambio();
