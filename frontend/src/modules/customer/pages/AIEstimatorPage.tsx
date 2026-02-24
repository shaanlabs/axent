import { useState } from "react";
import { Upload, Image as ImageIcon, Video, Sparkles, TrendingUp, Clock, DollarSign, MapPin } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { Textarea } from "../../../shared/components/ui/textarea";
import { motion } from "motion/react";

export function AIEstimatorPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const projectTypes = [
    "Excavation & Earth Moving",
    "Road Construction",
    "Building Foundation",
    "Demolition",
    "Pipeline Installation",
    "Cable Laying & Trenching",
    "Agriculture & Farming",
    "Industrial Drilling",
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const [recommendations, setRecommendations] = useState<any[]>([
    {
      name: "CAT 320 Excavator",
      type: "Heavy Excavator",
      cost: "$850-1,200/day",
      image: "https://images.unsplash.com/photo-1759950345011-ee5a96640e00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGNhdmF0b3IlMjBjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3MTA5ODMyNHww&ixlib=rb-4.1.0&q=80&w=1080",
      confidence: 95,
      distance: "3.5 km",
    },
    {
      name: "HDD Drilling Rig",
      type: "Horizontal Directional Drill",
      cost: "$2,500-3,800/day",
      image: "https://images.unsplash.com/photo-1629540946404-ebe133e99f49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZHJpbGxpbmclMjByaWclMjBtYWNoaW5lcnl8ZW58MXx8fHwxNzcxMDk4MzI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      confidence: 88,
      distance: "5.8 km",
    },
    {
      name: "750 KVA Generator",
      type: "Power Generator",
      cost: "$450-650/day",
      image: "https://images.unsplash.com/photo-1665833130884-a50faef72fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBnZW5lcmF0b3IlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzcxMDg5MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      confidence: 92,
      distance: "2.1 km",
    },
  ]);
  const [estimationData, setEstimationData] = useState<{
    min_cost?: number;
    max_cost?: number;
    duration?: number;
  }>({});

  const handleAnalyze = async () => {
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("work_type", projectType);

      uploadedFiles.forEach((file) => {
        formData.append("files", file);
      });

      // Point to our FastAPI backend AI service
      const API_URL = (import.meta as any).env.VITE_AI_BACKEND_URL || "http://localhost:8000/api/v1";

      const response = await fetch(`${API_URL}/analyzer/analyze-project`, {
        method: "POST",
        body: formData,
        // Add Authorization header here later using Clerk token
      });

      if (!response.ok) {
        throw new Error("Failed to analyze project");
      }

      const data = await response.json();

      // Update UI with real estimations from Keras backend
      setEstimationData({
        min_cost: data.estimation.estimated_cost_min || 4800,
        max_cost: data.estimation.estimated_cost_max || 6500,
        duration: data.estimation.estimated_duration_days || 15
      });

      // Keep static recommendations if API returns None (since we don't have real Qdrant data locally yet)
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
      }

    } catch (error) {
      console.error("Analysis Error:", error);
      // Fallback data if backend is offline
      setEstimationData({ min_cost: 4800, max_cost: 6500, duration: 15 });
    } finally {
      setAnalyzing(false);
      setShowResults(true);
    }
  };


  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">
              AI-Powered Analysis
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Project Estimation & Equipment Recommendations
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload project images or describe your requirements. Our AI analyzes and recommends optimal equipment with accurate cost estimates.
          </p>
        </div>

        {!showResults ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Project Type Selection */}
            <div className="glass-effect rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Project Type *
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              >
                <option value="">Select project type</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Upload Project Files
              </h3>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports images (JPG, PNG) and videos (MP4, MOV)
                  </p>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-white/5 rounded-lg flex items-center justify-center border border-white/10"
                    >
                      {file.type.startsWith("image") ? (
                        <ImageIcon className="w-8 h-8 text-primary" />
                      ) : (
                        <Video className="w-8 h-8 text-accent" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Description */}
            <div className="glass-effect rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Project Description
              </label>
              <Textarea
                placeholder="Describe your project: scope of work, location details, timeline, specific requirements..."
                className="min-h-[120px] bg-white/5 border-white/10 text-white resize-none"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              />
            </div>

            {/* Location */}
            <div className="glass-effect rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Project Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter project location"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white"
                />
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={analyzing || !projectType || (uploadedFiles.length === 0 && !description)}
              className="w-full gradient-gold text-[#0B0B0D] py-6 h-auto"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {analyzing ? "Analyzing..." : "Analyze with AI"}
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Analysis Summary */}
            <div className="glass-effect rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                AI Analysis Complete
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="p-5 bg-white/5 rounded-xl">
                  <DollarSign className="w-8 h-8 text-primary mb-3" />
                  <div className="text-xl font-bold text-white mb-1">
                    ${estimationData.min_cost?.toLocaleString()} - ${estimationData.max_cost?.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Daily Cost Estimate
                  </div>
                </div>
                <div className="p-5 bg-white/5 rounded-xl">
                  <Clock className="w-8 h-8 text-accent mb-3" />
                  <div className="text-xl font-bold text-white mb-1">
                    {estimationData.duration} Days
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration
                  </div>
                </div>
                <div className="p-5 bg-white/5 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-teal mb-3" />
                  <div className="text-xl font-bold text-white mb-1">
                    Medium
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Complexity
                  </div>
                </div>
                <div className="p-5 bg-white/5 rounded-xl">
                  <Sparkles className="w-8 h-8 text-primary mb-3" />
                  <div className="text-xl font-bold text-white mb-1">
                    92%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confidence
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Equipment */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Recommended Equipment Nearby
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {recommendations.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-effect rounded-xl overflow-hidden hover:shadow-luxury transition-all"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-primary rounded-full">
                        <span className="text-xs font-bold text-[#0B0B0D]">
                          {item.confidence}% Match
                        </span>
                      </div>
                      <div className="absolute top-3 left-3 px-2 py-1 glass-effect rounded-full">
                        <span className="text-xs font-semibold text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.distance}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.type}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {item.cost}
                        </span>
                        <Button size="sm" className="gradient-gold text-[#0B0B0D]">
                          View
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setShowResults(false)}
                variant="outline"
                className="border-white/20"
              >
                New Analysis
              </Button>
              <Button className="gradient-gold text-[#0B0B0D]">
                Proceed to Marketplace
              </Button>
            </div>
          </motion.div>
        )}

        {/* Analysis Animation */}
        {analyzing && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect rounded-2xl p-12 text-center max-w-md"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
              />
              <h3 className="text-2xl font-bold text-white mb-3">
                Analyzing Your Project
              </h3>
              <p className="text-muted-foreground">
                AI is processing requirements and matching equipment...
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
