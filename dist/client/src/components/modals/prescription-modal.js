import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, Plus, Trash2 } from "lucide-react";
export default function PrescriptionModal({ isOpen, onClose, patientId, patientName = "Patient", appointmentId }) {
    const [formData, setFormData] = useState({
        diagnosis: "",
        instructions: "",
        followUpDate: "",
    });
    const [medications, setMedications] = useState([
        { name: "", dosage: "", frequency: "", duration: "" }
    ]);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const createPrescriptionMutation = useMutation({
        mutationFn: async (prescriptionData) => {
            const response = await apiRequest('POST', '/api/prescriptions', prescriptionData);
            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Prescription created successfully!",
            });
            queryClient.invalidateQueries({ queryKey: ['/api/prescriptions/my'] });
            queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
            onClose();
            resetForm();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create prescription",
                variant: "destructive",
            });
        },
    });
    const resetForm = () => {
        setFormData({
            diagnosis: "",
            instructions: "",
            followUpDate: "",
        });
        setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
    };
    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleMedicationChange = (index, field, value) => {
        setMedications(prev => prev.map((med, i) => i === index ? { ...med, [field]: value } : med));
    };
    const addMedication = () => {
        setMedications(prev => [...prev, { name: "", dosage: "", frequency: "", duration: "" }]);
    };
    const removeMedication = (index) => {
        if (medications.length > 1) {
            setMedications(prev => prev.filter((_, i) => i !== index));
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.diagnosis) {
            toast({
                title: "Missing Information",
                description: "Please enter a diagnosis",
                variant: "destructive",
            });
            return;
        }
        const validMedications = medications.filter(med => med.name.trim() && med.dosage.trim() && med.frequency.trim());
        if (validMedications.length === 0) {
            toast({
                title: "Missing Information",
                description: "Please add at least one medication",
                variant: "destructive",
            });
            return;
        }
        const prescriptionData = {
            ...(appointmentId && { appointmentId }),
            ...(patientId && { patientId }),
            diagnosis: formData.diagnosis,
            medications: JSON.stringify(validMedications),
            instructions: formData.instructions,
            ...(formData.followUpDate && {
                followUpDate: new Date(formData.followUpDate).toISOString()
            }),
            isActive: true,
        };
        createPrescriptionMutation.mutate(prescriptionData);
    };
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Digital Prescription</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6"/>
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </Label>
              <Input type="text" value={patientName} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly/>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </Label>
              <Input type="date" value={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readOnly/>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis *
            </Label>
            <Textarea value={formData.diagnosis} onChange={(e) => handleInputChange("diagnosis", e.target.value)} placeholder="Enter diagnosis..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent" rows={3} required/>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Medications *
            </Label>
            <div className="space-y-3">
              {medications.map((medication, index) => (<div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <Input type="text" placeholder="Medication name" value={medication.name} onChange={(e) => handleMedicationChange(index, "name", e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-medical-blue focus:border-transparent"/>
                  <Input type="text" placeholder="Dosage" value={medication.dosage} onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)} className="w-24 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-medical-blue focus:border-transparent"/>
                  <Input type="text" placeholder="Frequency" value={medication.frequency} onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)} className="w-32 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-medical-blue focus:border-transparent"/>
                  <Input type="text" placeholder="Duration" value={medication.duration} onChange={(e) => handleMedicationChange(index, "duration", e.target.value)} className="w-24 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-medical-blue focus:border-transparent"/>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeMedication(index)} disabled={medications.length === 1} className="text-medical-red hover:text-red-700">
                    <Trash2 className="w-5 h-5"/>
                  </Button>
                </div>))}
              <Button type="button" variant="outline" size="sm" onClick={addMedication} className="text-medical-blue hover:text-blue-700">
                <Plus className="w-4 h-4 mr-2"/>
                Add Medication
              </Button>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </Label>
            <Textarea value={formData.instructions} onChange={(e) => handleInputChange("instructions", e.target.value)} placeholder="Additional instructions for the patient..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent" rows={3}/>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date
            </Label>
            <Input type="date" value={formData.followUpDate} onChange={(e) => handleInputChange("followUpDate", e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"/>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPrescriptionMutation.isPending} className="medical-blue text-white hover:bg-blue-700">
              {createPrescriptionMutation.isPending ? "Generating..." : "Generate Prescription"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);
}
