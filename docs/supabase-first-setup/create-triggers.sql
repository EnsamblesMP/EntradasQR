trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_templates_updated_at_trigger
BEFORE UPDATE ON email_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Triggers para registrar cambios
CREATE TRIGGER trigger_historial_entradas
    AFTER INSERT OR UPDATE OR DELETE ON entradas
    FOR EACH ROW EXECUTE FUNCTION registrar_historial_cambio();
CREATE TRIGGER trigger_historial_alumnos
    AFTER INSERT OR UPDATE OR DELETE ON alumnos
    FOR EACH ROW EXECUTE FUNCTION registrar_historial_cambio();
