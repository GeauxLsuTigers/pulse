import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserGuardContext } from "app";
import { DashboardLayout } from "../components/DashboardLayout";
import { useProspectStore } from "../utils/prospectStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import brain from "brain";
import { inspect_api } from "brain/api-inspector";

export default function Prospects() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const { prospects, isLoading, addProspect, updateProspect, deleteProspect } = useProspectStore();
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isAddingProspect, setIsAddingProspect] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvValidationResults, setCsvValidationResults] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newProspect, setNewProspect] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    position: '',
    location: '',
    linkedin: '',
    notes: '',
    tags: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImportCSV = () => {
    setIsImporting(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      setCsvValidationResults(null);
    }
  };
  
  const handleValidateCSV = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }
    
    setIsValidating(true);
    
    try {
      const formData = new FormData();
      formData.append("file", csvFile);
      
      const response = await brain.validate_csv({}, formData);
      const data = await response.json();
      
      setCsvValidationResults(data);
    } catch (error) {
      console.error("Error validating CSV:", error);
      toast.error("Error validating CSV file");
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleUploadCSV = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", csvFile);
      
      const response = await brain.upload_csv({}, formData);
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Successfully imported ${data.imported} prospects`);
        setIsImporting(false);
        setCsvFile(null);
        setCsvValidationResults(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        toast.error("Error importing prospects");
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("Error uploading CSV file");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCancelImport = () => {
    setIsImporting(false);
    setCsvFile(null);
    setCsvValidationResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleAddProspect = () => {
    setIsAddingProspect(true);
  };
  
  const handleProspectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProspect(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitProspect = async () => {
    try {
      // Validate required fields
      if (!newProspect.firstName || !newProspect.lastName || !newProspect.email || !newProspect.company || !newProspect.position) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      // Validate email format
      const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!emailRegex.test(newProspect.email)) {
        toast.error("Please enter a valid email");
        return;
      }
      
      // Process tags
      const tags = newProspect.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // Create prospect in Firestore
      await addProspect({
        ...newProspect,
        tags,
        userId: user.uid,
        status: 'new'
      });
      
      toast.success("Prospect added successfully");
      setIsAddingProspect(false);
      setNewProspect({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        position: '',
        location: '',
        linkedin: '',
        notes: '',
        tags: ''
      });
    } catch (error) {
      console.error("Error adding prospect:", error);
      toast.error("Error adding prospect");
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Prospects</h1>
            <p className="text-muted-foreground">Manage your sales prospects</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleImportCSV}
            >
              Import CSV
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  setIsGeneratingData(true);
                  const response = await brain.generate_sample_data({});
                  const data = await response.json();
                  if (data.success) {
                    // Add each prospect to Firestore
                    for (const prospect of data.prospects) {
                      // Use the Firestore addDoc function directly since we already have formatted data
                      await addProspect(prospect);
                    }
                    toast.success(`Generated ${data.count} sample prospects`);
                  }
                } catch (error) {
                  console.error("Error generating sample data:", error);
                  toast.error("Failed to generate sample data");
                } finally {
                  setIsGeneratingData(false);
                }
              }}
              disabled={isGeneratingData}
            >
              {isGeneratingData ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                  Loading...
                </>
              ) : (
                "Load Sample Data"
              )}
            </Button>
            <Button
              variant="default"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
              onClick={handleAddProspect}
            >
              Add Prospect
            </Button>
          </div>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="relative max-w-sm">
              <Input
                type="text"
                placeholder="Search prospects..."
                className="pl-10 bg-background/50"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground text-sm">Filter:</span>
              <Button variant="outline" size="sm">
                All
              </Button>
              <Button variant="outline" size="sm">
                New
              </Button>
              <Button variant="outline" size="sm">
                Contacted
              </Button>
              <Button variant="outline" size="sm">
                Responded
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="h-8 w-8 rounded-full border-2 border-r-transparent border-blue-500 animate-spin"></div>
            </div>
          ) : prospects.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No prospects yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get started by importing prospects from a CSV file or adding them manually.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button variant="outline" onClick={handleImportCSV}>
                  Import CSV
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                  onClick={handleAddProspect}
                >
                  Add Manually
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
                <div className="col-span-2">Name / Company</div>
                <div className="col-span-1">Position</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Tags</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              <div className="divide-y">
                {prospects.map((prospect) => (
                  <div key={prospect.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/50">
                    <div className="col-span-2">
                      <div className="font-medium">{prospect.firstName} {prospect.lastName}</div>
                      <div className="text-sm text-muted-foreground">{prospect.company}</div>
                    </div>
                    <div className="col-span-1">{prospect.position}</div>
                    <div className="col-span-1">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                        {prospect.status}
                      </span>
                    </div>
                    <div className="col-span-1 flex flex-wrap gap-1">
                      {prospect.tags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="col-span-1 flex justify-end space-x-2">
                      <button 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => toast.info("Edit functionality coming soon")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button 
                      className="text-muted-foreground hover:text-red-500"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this prospect?')) {
                          deleteProspect(prospect.id);
                          toast.success("Prospect deleted");
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSV Import Dialog */}
      <Dialog open={isImporting} onOpenChange={setIsImporting}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Prospects from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with your prospects. The file should include columns for first name, last name, email, company, and position.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="csv">CSV File</Label>
              <Input 
                id="csv" 
                type="file" 
                accept=".csv" 
                ref={fileInputRef}
                onChange={handleFileChange} 
              />
            </div>
            
            {csvFile && (
              <div className="text-sm">
                <p className="font-medium">Selected file:</p>
                <p>{csvFile.name} ({Math.round(csvFile.size / 1024)} KB)</p>
              </div>
            )}
            
            {csvValidationResults && (
              <div className="space-y-2">
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium">Validation Results:</p>
                  <p>Total rows: {csvValidationResults.total}</p>
                  <p>Ready to import: {csvValidationResults.importable}</p>
                  {csvValidationResults.errors.length > 0 && (
                    <p className="text-red-500">{csvValidationResults.errors.length} errors found</p>
                  )}
                </div>
                
                {csvValidationResults.sampleProspects && csvValidationResults.sampleProspects.length > 0 && (
                  <div>
                    <p className="font-medium">Sample data preview:</p>
                    <div className="text-xs overflow-x-auto max-h-32 bg-background/50 rounded border p-2">
                      {csvValidationResults.sampleProspects.map((prospect: any, i: number) => (
                        <div key={i} className="mb-1">
                          <span>{prospect.firstName} {prospect.lastName}</span>
                          <span className="mx-1 text-muted-foreground">•</span>
                          <span className="text-blue-500">{prospect.email}</span>
                          <span className="mx-1 text-muted-foreground">•</span>
                          <span>{prospect.company}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleCancelImport}>Cancel</Button>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={handleValidateCSV}
                  disabled={!csvFile || isValidating}
                >
                  {isValidating ? "Validating..." : "Validate"}  
                </Button>
                <Button 
                  onClick={handleUploadCSV} 
                  disabled={!csvFile || isUploading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                >
                  {isUploading ? "Importing..." : "Import"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Prospect Dialog */}
      <Dialog open={isAddingProspect} onOpenChange={setIsAddingProspect}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Prospect</DialogTitle>
            <DialogDescription>
              Enter the details of your new prospect below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={newProspect.firstName} 
                  onChange={handleProspectInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={newProspect.lastName} 
                  onChange={handleProspectInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={newProspect.email} 
                onChange={handleProspectInputChange} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input 
                  id="company" 
                  name="company" 
                  value={newProspect.company} 
                  onChange={handleProspectInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input 
                  id="position" 
                  name="position" 
                  value={newProspect.position} 
                  onChange={handleProspectInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={newProspect.location} 
                onChange={handleProspectInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input 
                id="linkedin" 
                name="linkedin" 
                value={newProspect.linkedin} 
                onChange={handleProspectInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">
                Tags <span className="text-xs text-muted-foreground">(comma separated)</span>
              </Label>
              <Input 
                id="tags" 
                name="tags" 
                value={newProspect.tags} 
                onChange={handleProspectInputChange} 
                placeholder="e.g. enterprise, decision-maker, marketing" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={newProspect.notes} 
                onChange={handleProspectInputChange} 
                rows={3} 
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingProspect(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitProspect} 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
            >
              Add Prospect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}