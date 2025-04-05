import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, GraduationCap, Award, Users, BookOpen } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import axios from "axios"


interface HighlightsData {
  keySkills: string[];
  notableAchievements: string[];
  professionalSummary: string;
  experience: {
    title: string;
    company: string;
    location: string;
    period: string;
    responsibilities: string[];
  }[];
  education: {
    degree: string;
    school: string;
    period: string;
    details: string;
    achievements: string[];
    thesis?: string;
  }[];
  training: {
    recentTraining: {
      title: string;
      provider: string;
      date: string;
      description: string;
    }[];
    conferences: {
      name: string;
      location: string;
      year: string;
    }[];
    speaking: {
      title: string;
      event: string;
      role: string;
    }[];
  };
  organizations: {
    professional: {
      name: string;
      role: string;
      period: string;
      description: string;
    }[];
    volunteer: {
      name: string;
      role: string;
      period: string;
      description: string;
    }[];
    alumni: {
      name: string;
      role: string;
      period: string;
    }[];
  };
}

export default function PortfolioSections() {
  const [data, setData] = useState<HighlightsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("highlights");
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/data/highlights.json');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching highlights data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (loading) {
    return <div className="container mx-auto py-10 px-4 md:px-6">Loading...</div>;
  }

  if (!data) {
    return <div className="container mx-auto py-10 px-4 md:px-6">Error loading data</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 relative">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Professional Portfolio</h1>

      <div ref={tabsRef} className="sticky-tabs-container">
        <Tabs 
          defaultValue="highlights" 
          className="w-full relative"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 sticky top-0 z-10 shadow-md bg-background mb-6 rounded-lg">
            <TabsTrigger 
              value="highlights" 
              className="flex items-center gap-2 tab-trigger"
            >
              <Award className="h-4 w-4" />
              <span className="hidden md:inline">Highlights</span>
            </TabsTrigger>
            <TabsTrigger 
              value="experience" 
              className="flex items-center gap-2 tab-trigger"
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Experience</span>
            </TabsTrigger>
            <TabsTrigger 
              value="education" 
              className="flex items-center gap-2 tab-trigger"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden md:inline">Education</span>
            </TabsTrigger>
            <TabsTrigger 
              value="training" 
              className="flex items-center gap-2 tab-trigger"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger 
              value="organizations" 
              className="flex items-center gap-2 tab-trigger"
            >
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Organizations</span>
            </TabsTrigger>
          </TabsList>

          <div className="tab-content-area mt-6">
            {/* Professional Highlights Section */}
            <TabsContent value="highlights" className="transition-all duration-500 ease-in-out">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Professional Highlights
                  </CardTitle>
                  <CardDescription>Key achievements and skills that defines my professional profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Key Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {data.keySkills.map((skill, index) => (
                          <Badge key={index}>{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Notable Achievements</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        {data.notableAchievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
                      <p className="text-muted-foreground">
                        {data.professionalSummary}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Work Experience Section */}
            <TabsContent value="experience" className="transition-all duration-500 ease-in-out">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Work Experience
                  </CardTitle>
                  <CardDescription>Professional roles and responsibilities throughout your career</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {data.experience.map((job, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4 pb-2 relative">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5"></div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{job.company}</span>
                            <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{job.period}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{job.location}</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {job.responsibilities.map((responsibility, respIndex) => (
                            <li key={respIndex}>{responsibility}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Section */}
            <TabsContent value="education" className="transition-all duration-500 ease-in-out">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                  <CardDescription>Academic qualifications and educational background</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {data.education.map((edu, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/4">
                          <span className="text-sm font-medium text-muted-foreground">{edu.period}</span>
                        </div>
                        <div className="md:w-3/4">
                          <h3 className="text-lg font-semibold">{edu.degree}</h3>
                          <p className="text-muted-foreground">{edu.school}</p>
                          <p className="text-sm mt-1">{edu.details}</p>
                          <div className="mt-2">
                            {edu.achievements.map((achievement, achIndex) => (
                              <Badge key={achIndex} variant="outline" className={achIndex > 0 ? "ml-2" : ""}>
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                          {edu.thesis && (
                            <p className="text-sm mt-2">
                              Thesis: "{edu.thesis}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Training and Seminars Section */}
            <TabsContent value="training" className="transition-all duration-500 ease-in-out">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Training and Seminars Attended
                  </CardTitle>
                  <CardDescription>Professional development activities and continuing education</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Recent Training Programs</h3>
                      <div className="grid gap-4">
                        {data.training.recentTraining.map((training, index) => (
                          <div key={index} className="bg-muted p-4 rounded-lg">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <h4 className="font-medium">{training.title}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 bg-background rounded-full">{training.date}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{training.provider}</p>
                            <p className="text-sm">{training.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Conferences and Seminars</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.training.conferences.map((conference, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Badge className="mt-0.5">{conference.year}</Badge>
                            <div>
                              <p className="font-medium">{conference.name}</p>
                              <p className="text-sm text-muted-foreground">{conference.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* <div>
                      <h3 className="text-lg font-semibold mb-3">Speaking Engagements</h3>
                      <div className="space-y-3">
                        {data.training.speaking.map((speaking, index) => (
                          <div key={index}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <h4 className="font-medium">"{speaking.title}"</h4>
                              <span className="text-sm text-muted-foreground">{speaking.event}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{speaking.role}</p>
                          </div>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clubs & Organizations Section */}
            <TabsContent value="organizations" className="transition-all duration-500 ease-in-out">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Clubs & Organizations
                  </CardTitle>
                  <CardDescription>Professional associations and community involvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Professional Associations</h3>
                      <div className="grid gap-6">
                        {data.organizations.professional.map((org, index) => (
                          <div key={index} className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/4">
                              <span className="text-sm font-medium text-muted-foreground">{org.period}</span>
                            </div>
                            <div className="md:w-3/4">
                              <h4 className="font-medium">{org.name}</h4>
                              <p className="text-sm text-muted-foreground mb-1">{org.role}</p>
                              <p className="text-sm">{org.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  {/*   <div>
                      <h3 className="text-lg font-semibold mb-3">Volunteer & Community Service</h3>
                      <div className="grid gap-6">
                        {data.organizations.volunteer.map((vol, index) => (
                          <div key={index} className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/4">
                              <span className="text-sm font-medium text-muted-foreground">{vol.period}</span>
                            </div>
                            <div className="md:w-3/4">
                              <h4 className="font-medium">{vol.name}</h4>
                              <p className="text-sm text-muted-foreground mb-1">{vol.role}</p>
                              <p className="text-sm">{vol.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div> */}

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Alumni Associations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.organizations.alumni.map((alumni, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Badge className="mt-0.5">{alumni.period}</Badge>
                            <div>
                              <p className="font-medium">{alumni.name}</p>
                              <p className="text-sm text-muted-foreground">{alumni.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <style>{`
        .tab-content-area {
          transition: opacity 0.3s ease-in-out;
        }
        
        .tab-trigger:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        
        .sticky-tabs-container {
          position: relative;
          z-index: 10;
        }
      `}</style>
    </div>
  )
}


