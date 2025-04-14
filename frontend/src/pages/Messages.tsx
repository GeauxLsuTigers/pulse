import React, { useState, useEffect } from "react";
import { useUserGuardContext, firebaseAuth } from "app";
import { DashboardLayout } from "../components/DashboardLayout";
import { useProspectStore } from "../utils/prospectStore";
import { doc, setDoc, collection } from "firebase/firestore";
import { firebaseApp } from "app";
import { getFirestore } from "firebase/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import brain from "brain";

export default function Messages() {
  // Get Firestore instance
  const db = getFirestore(firebaseApp);
  const { user } = useUserGuardContext();
  const { prospects, isLoading: prospectsLoading, initializeProspectsListener } = useProspectStore();
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedProspect, setSelectedProspect] = useState("");
  const [selectedMessageType, setSelectedMessageType] = useState("email");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingDummy, setIsCreatingDummy] = useState(false);
  
  // User data for message generation
  const [userData, setUserData] = useState({
    sender_name: "",
    sender_position: "",
    company_name: "",
    value_proposition: "",
  });
  
  // Custom prompt for message generation
  const [customPrompt, setCustomPrompt] = useState("");
  
  // Initialize listeners for prospects
  useEffect(() => {
    if (user) {
      console.log("Initializing prospects listener for user:", user.uid);
      initializeProspectsListener(user.uid);
    }
  }, [user, initializeProspectsListener]);
  
  // Log when prospects change
  useEffect(() => {
    console.log("Current prospects state:", prospects);
  }, [prospects]);
  
  // Create dummy prospects for testing
  const createDummyProspects = async () => {
    console.log("Creating dummy prospects...");
    if (!user) return;
    
    setIsCreatingDummy(true);
    
    try {
      const dummyProspects = [
        {
          id: `dummy1-${Date.now()}`,
          userId: user.uid,
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@techvision.com",
          company: "TechVision Inc.",
          position: "CTO",
          location: "San Francisco, CA",
          linkedin: "linkedin.com/in/sarahjohnson",
          website: "techvision.com",
          phone: "+1 (555) 123-4567",
          notes: "Interested in AI solutions",
          status: "new",
          tags: ["tech", "AI", "enterprise"],
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: `dummy2-${Date.now()}`,
          userId: user.uid,
          firstName: "Michael",
          lastName: "Chen",
          email: "michael.chen@cloudscale.io",
          company: "CloudScale",
          position: "VP of Engineering",
          location: "Seattle, WA",
          linkedin: "linkedin.com/in/michaelchen",
          website: "cloudscale.io",
          phone: "+1 (555) 987-6543",
          notes: "Looking for scalable solutions",
          status: "new",
          tags: ["cloud", "enterprise", "B2B"],
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: `dummy3-${Date.now()}`,
          userId: user.uid,
          firstName: "Emily",
          lastName: "Rodriguez",
          email: "emily.r@finnovate.com",
          company: "Finnovate Partners",
          position: "Director of Digital Transformation",
          location: "Boston, MA",
          linkedin: "linkedin.com/in/emilyrodriguez",
          website: "finnovate.com",
          phone: "+1 (555) 789-0123",
          notes: "Exploring automation solutions",
          status: "new",
          tags: ["finance", "digital transformation"],
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
      ];
      
      console.log("Dummy prospects created:", dummyProspects);
      
      // Save each prospect to Firestore
      const prospectCollection = collection(db, "prospects");
      console.log("Using collection reference:", prospectCollection);
      
      for (const prospect of dummyProspects) {
        try {
          console.log("Saving prospect:", prospect.id);
          const prospectRef = doc(prospectCollection, prospect.id);
          await setDoc(prospectRef, prospect);
          console.log("Prospect saved successfully:", prospect.id);
        } catch (error) {
          console.error("Error saving individual prospect:", error);
        }
      }
      
      toast.success("Sample prospects created successfully!");
      // Refresh the prospect list - the listener should pick up the changes
    } catch (error) {
      console.error("Error creating sample prospects:", error);
      toast.error("Failed to create sample prospects");
    } finally {
      setIsCreatingDummy(false);
    }
  };
  
  // Get selected prospect data
  const getSelectedProspect = () => {
    return prospects.find(p => p.id === selectedProspect);
  };
  
  // Generate message
  const handleGenerateMessage = async () => {
    try {
      const prospect = getSelectedProspect();
      if (!prospect) {
        toast.error("Please select a prospect");
        return;
      }
      
      setIsGenerating(true);
      
      // Prepare prospect data
      const prospectData = {
        first_name: prospect.firstName,
        last_name: prospect.lastName,
        full_name: `${prospect.firstName} ${prospect.lastName}`,
        email: prospect.email,
        prospect_company: prospect.company,
        prospect_position: prospect.position,
        prospect_location: prospect.location || "",
        prospect_linkedin: prospect.linkedin || "",
        prospect_tags: prospect.tags.join(", "),
      };
      
      // Call API to generate message
      const response = await brain.generate_message({
        prospectId: prospect.id,
        messageType: selectedMessageType,
        customPrompt: customPrompt || undefined,
        prospectData,
        userData,
      });
      
      const data = await response.json();
      setGeneratedMessage(data.message);
      
      toast.success("Message generated successfully");
    } catch (error) {
      console.error("Error generating message:", error);
      toast.error("Error generating message");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Message Center</h1>
            <p className="text-muted-foreground">Create and manage outreach messages</p>
          </div>
          <Button
            variant="outline"
            className="border-indigo-500/50 text-indigo-400"
            onClick={() => {
              console.log("Create Sample Prospects button clicked");
              createDummyProspects();
            }}
            disabled={isCreatingDummy}
          >
            {isCreatingDummy ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                Creating...
              </>
            ) : (
              "Create Sample Prospects"
            )}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="generate">Generate Messages</TabsTrigger>
            <TabsTrigger value="templates">Manage Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/30 backdrop-blur-sm border border-border/40">
                <CardHeader>
                  <CardTitle>Message Generator</CardTitle>
                  <CardDescription>Generate personalized outreach messages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prospect">Select Prospect</Label>
                    <Select value={selectedProspect} onValueChange={setSelectedProspect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a prospect" />
                      </SelectTrigger>
                      <SelectContent>
                        {prospectsLoading ? (
                          <SelectItem value="loading" disabled>Loading prospects...</SelectItem>
                        ) : prospects.length === 0 ? (
                          <div className="p-3 text-center">
                            <p className="text-muted-foreground text-sm mb-2">No prospects found</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                createDummyProspects();
                              }}
                              className="w-full text-xs"
                              disabled={isCreatingDummy}
                            >
                              {isCreatingDummy ? "Creating..." : "Create Sample Prospects"}
                            </Button>
                          </div>
                        ) : (
                          prospects.map((prospect) => (
                            <SelectItem key={prospect.id} value={prospect.id}>
                              {prospect.firstName} {prospect.lastName} - {prospect.company}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="messageType">Message Type</Label>
                    <Select value={selectedMessageType} onValueChange={setSelectedMessageType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="linkedin">LinkedIn Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="sender_info">Your Information</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Input 
                          placeholder="Your Name"
                          value={userData.sender_name}
                          onChange={(e) => setUserData({ ...userData, sender_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Input 
                          placeholder="Your Position"
                          value={userData.sender_position}
                          onChange={(e) => setUserData({ ...userData, sender_position: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <Input 
                          placeholder="Company Name"
                          value={userData.company_name}
                          onChange={(e) => setUserData({ ...userData, company_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Input 
                          placeholder="Value Proposition"
                          value={userData.value_proposition}
                          onChange={(e) => setUserData({ ...userData, value_proposition: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customPrompt">Additional Instructions (Optional)</Label>
                    <Textarea 
                      id="customPrompt"
                      placeholder="E.g., Focus on their recent funding, mention our case study with similar companies"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      onClick={() => handleGenerateMessage()}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                      disabled={isGenerating || !selectedProspect}
                    >
                      {isGenerating ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                          Generating...
                        </>
                      ) : (
                        "Generate Message"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/30 backdrop-blur-sm border border-border/40">
                <CardHeader>
                  <CardTitle>Generated Message</CardTitle>
                  <CardDescription>Preview your personalized message</CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedMessage ? (
                    <div className="p-4 rounded-md bg-background/50 border min-h-[300px] whitespace-pre-wrap">
                      {generatedMessage}
                    </div>
                  ) : (
                    <div className="p-4 rounded-md bg-background/30 border border-dashed flex items-center justify-center min-h-[300px] text-muted-foreground text-center">
                      <div>
                        <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p>Select a prospect and click "Generate Message"<br />to create a personalized message</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" size="sm" disabled={!generatedMessage} onClick={() => setGeneratedMessage("")}>                    Clear
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    disabled={!generatedMessage}
                    onClick={() => {
                      navigator.clipboard.writeText(generatedMessage);
                      toast.success("Message copied to clipboard");
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-md bg-card/30 backdrop-blur-sm border border-border/40 text-center">
                <h2 className="text-2xl font-semibold mb-4">Template Management</h2>
                <p className="text-muted-foreground">Create and manage message templates...</p>
                <Button
                  className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
                >
                  Create Template
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}