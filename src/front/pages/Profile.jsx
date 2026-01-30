import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  Plus,
  Trash2,
  Linkedin,
  Globe,
  Bell,
  BellOff,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';

export function UserProfileView({ profile, onUpdateProfile }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [newAlert, setNewAlert] = useState({
    location: '',
    minSalary: '',
    contractType: '',
    keywords: '',
    active: true,
  });

  const handleSave = () => {
    onUpdateProfile(formData);
    setEditMode(false);
    toast.success('Perfil actualizado correctamente');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Mock file upload
      const mockUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        cvUrl: mockUrl,
        cvFileName: file.name,
      });
      toast.success('CV subido correctamente');
    }
  };

  const handleAddAlert = () => {
    if (!newAlert.location && !newAlert.keywords) {
      toast.error('Agrega al menos una ubicación o palabra clave');
      return;
    }

    const alert = {
      id: Date.now().toString(),
      location: newAlert.location || undefined,
      minSalary: newAlert.minSalary || undefined,
      contractType: newAlert.contractType || undefined,
      keywords: newAlert.keywords || undefined,
      active: true,
    };

    setFormData({
      ...formData,
      alerts: [...(formData.alerts || []), alert],
    });

    setNewAlert({
      location: '',
      minSalary: '',
      contractType: '',
      keywords: '',
      active: true,
    });

    toast.success('Alerta creada');
  };

  const handleToggleAlert = (alertId) => {
    setFormData({
      ...formData,
      alerts: (formData.alerts || []).map((alert) =>
        alert.id === alertId ? { ...alert, active: !alert.active } : alert
      ),
    });
  };

  const handleDeleteAlert = (alertId) => {
    setFormData({
      ...formData,
      alerts: (formData.alerts || []).filter((alert) => alert.id !== alertId),
    });
    toast.success('Alerta eliminada');
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0F2C33]">Información Personal</h2>
          {!editMode ? (
            <Button onClick={() => setEditMode(true)} className="bg-[#21616A] hover:bg-[#0F2C33]">
              Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(profile);
                  setEditMode(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-[#21616A] hover:bg-[#0F2C33]">
                Guardar
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <div className="flex items-center gap-2">
              <User className="size-5 text-[#6B7280]" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-[#6B7280]" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <div className="flex items-center gap-2">
              <Phone className="size-5 text-[#6B7280]" />
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editMode}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="flex items-center gap-2">
              <Linkedin className="size-5 text-[#6B7280]" />
              <Input
                id="linkedin"
                value={formData.linkedinUrl || ''}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                disabled={!editMode}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="portfolio">Portfolio / Sitio Web</Label>
            <div className="flex items-center gap-2">
              <Globe className="size-5 text-[#6B7280]" />
              <Input
                id="portfolio"
                value={formData.portfolioUrl || ''}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                disabled={!editMode}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </Card>

      {/* CV Upload */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-[#374151] mb-6">Currículum Vitae</h2>

        {formData.cvFileName ? (
          <div className="flex items-center justify-between p-4 bg-[#F3F4F6] rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="size-6 text-[#1E3A8A]" />
              <div>
                <p className="font-medium text-[#374151]">{formData.cvFileName}</p>
                <p className="text-sm text-[#6B7280]">CV actual</p>
              </div>
            </div>
            {formData.cvUrl && (
              <Button variant="outline" onClick={() => window.open(formData.cvUrl, '_blank')}>
                Ver CV
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-[#D1D5DB] rounded-lg">
            <FileText className="size-12 text-[#9CA3AF] mx-auto mb-3" />
            <p className="text-[#6B7280] mb-4">No has subido tu CV aún</p>
          </div>
        )}

        <div className="mt-4">
          <Label htmlFor="cv-upload" className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 p-3 border-2 border-[#1E3A8A] text-[#1E3A8A] rounded-lg hover:bg-[#EFF6FF] transition-colors">
              <Upload className="size-5" />
              <span className="font-medium">{formData.cvFileName ? 'Actualizar CV' : 'Subir CV'}</span>
            </div>
          </Label>
          <Input
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </Card>

      {/* Job Alerts */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-[#0F2C33] mb-6">Alertas de Ofertas</h2>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Input
                placeholder="ej. Madrid, Barcelona"
                value={newAlert.location || ''}
                onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Salario mínimo</Label>
              <Input
                placeholder="ej. €35,000"
                value={newAlert.minSalary || ''}
                onChange={(e) => setNewAlert({ ...newAlert, minSalary: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de contrato</Label>
              <Input
                placeholder="ej. Remoto, Híbrido, Presencial"
                value={newAlert.contractType || ''}
                onChange={(e) => setNewAlert({ ...newAlert, contractType: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Palabras clave</Label>
              <Input
                placeholder="ej. React, Frontend, JavaScript"
                value={newAlert.keywords || ''}
                onChange={(e) => setNewAlert({ ...newAlert, keywords: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleAddAlert} className="w-full bg-[#21616A] hover:bg-[#0F2C33]">
            <Plus className="size-5 mr-2" />
            Crear Alerta
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="space-y-3">
          <h3 className="font-semibold text-[#0F2C33]">Alertas Activas</h3>

          {(formData.alerts || []).length > 0 ? (
            (formData.alerts || []).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-4 bg-[#E6D1B4]/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {alert.active ? (
                      <Bell className="size-4 text-[#2E9CA0]" />
                    ) : (
                      <BellOff className="size-4 text-[#9CA3AF]" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        alert.active ? 'text-[#0F2C33]' : 'text-[#9CA3AF]'
                      }`}
                    >
                      {alert.active ? 'Activa' : 'Pausada'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alert.location && (
                      <Badge variant="outline" className="bg-white">
                        📍 {alert.location}
                      </Badge>
                    )}
                    {alert.minSalary && (
                      <Badge variant="outline" className="bg-white">
                        💰 {alert.minSalary}
                      </Badge>
                    )}
                    {alert.contractType && (
                      <Badge variant="outline" className="bg-white">
                        💼 {alert.contractType}
                      </Badge>
                    )}
                    {alert.keywords && (
                      <Badge variant="outline" className="bg-white">
                        🔍 {alert.keywords}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Switch checked={alert.active} onCheckedChange={() => handleToggleAlert(alert.id)} />
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteAlert(alert.id)}>
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[#9CA3AF] py-4">No tienes alertas configuradas</p>
          )}
        </div>
      </Card>
    </div>
  );
}
