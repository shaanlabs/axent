import { useState } from "react";
import { Upload, MapPin, Calendar, DollarSign, FileText, Clock, Star, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../../../app/auth/auth-context";

export function ProjectBiddingPage() {
  const [showPostForm, setShowPostForm] = useState(false);
  const { user } = useAuth();
  const userRole = user?.role || "client";

  const projects = [
    {
      id: 1,
      title: "Highway Expansion - Phase 2 Excavation",
      description: "Large-scale excavation work for highway expansion project requiring heavy machinery.",
      budget: "$25,000 - $35,000",
      deadline: "15 days",
      location: "Houston, TX",
      distance: "3.2 km",
      bids: 12,
      postedBy: "Texas DOT",
      postedDate: "2 days ago",
      image: "https://images.unsplash.com/photo-1761896118911-6e7ba1d956ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwaW5mcmFzdHJ1Y3R1cmUlMjBwcm9qZWN0JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcxMDk4MzI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      equipmentNeeded: ["Excavators (3 units)", "Bulldozers (2 units)", "Dump Trucks (4 units)"],
    },
    {
      id: 2,
      title: "Commercial Building Foundation Work",
      description: "Foundation excavation and preparation for 15-story commercial building.",
      budget: "$50,000 - $75,000",
      deadline: "30 days",
      location: "Dallas, TX",
      distance: "6.5 km",
      bids: 8,
      postedBy: "Metro Construction Corp",
      postedDate: "4 days ago",
      image: "https://images.unsplash.com/photo-1659449082344-53f79e1e4198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3dlciUyMGNyYW5lJTIwY29uc3RydWN0aW9uJTIwc2t5bGluZXxlbnwxfHx8fDE3NzEwOTgzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      equipmentNeeded: ["Tower Cranes (2 units)", "Concrete Pumps (1 unit)", "Excavators (2 units)"],
    },
    {
      id: 3,
      title: "Underground Pipeline Installation",
      description: "Water pipeline installation requiring HDD drilling and excavation equipment.",
      budget: "$35,000 - $50,000",
      deadline: "20 days",
      location: "Austin, TX",
      distance: "8.9 km",
      bids: 15,
      postedBy: "City Water Authority",
      postedDate: "1 week ago",
      image: "https://images.unsplash.com/photo-1629540946404-ebe133e99f49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZHJpbGxpbmclMjByaWclMjBtYWNoaW5lcnl8ZW58MXx8fHwxNzcxMDk4MzI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      equipmentNeeded: ["HDD Rigs (2 units)", "Excavators (3 units)", "Generators (2 units)"],
    },
  ];

  const sampleBids = [
    {
      id: 1,
      vendorName: "Houston Heavy Equipment Co.",
      rating: 4.9,
      completedProjects: 45,
      bidAmount: "$28,500",
      timeline: "12 days",
      distance: "2.1 km",
      message: "We have all required equipment readily available. Can start within 48 hours.",
    },
    {
      id: 2,
      vendorName: "Texas Infrastructure Services",
      rating: 4.7,
      completedProjects: 38,
      bidAmount: "$31,200",
      timeline: "14 days",
      distance: "4.5 km",
      message: "Experienced team with excellent track record on similar highway projects.",
    },
    {
      id: 3,
      vendorName: "Metro Equipment Rentals",
      rating: 4.8,
      completedProjects: 52,
      bidAmount: "$29,800",
      timeline: "13 days",
      distance: "3.8 km",
      message: "Premium equipment with certified operators included in the quote.",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Project Bidding Platform
            </h1>
            <p className="text-muted-foreground">
              {userRole === "client"
                ? "Post your project and receive competitive bids from qualified vendors"
                : "Browse nearby projects and submit bids to win contracts"
              }
            </p>
          </div>
          {userRole === "client" && (
            <Button
              onClick={() => setShowPostForm(!showPostForm)}
              className="gradient-gold text-[#0B0B0D] px-6"
            >
              {showPostForm ? "View Projects" : "Post New Project"}
            </Button>
          )}
        </div>

        {showPostForm && userRole === "client" ? (
          /* Post Project Form */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-effect rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Post a New Project
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Project Title *
                  </label>
                  <Input
                    placeholder="e.g., Highway Expansion - Excavation Work"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Project Description *
                  </label>
                  <Textarea
                    placeholder="Provide detailed information about your project, scope of work, requirements..."
                    className="min-h-[150px] bg-white/5 border-white/10 resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Budget Range *
                    </label>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Min"
                        type="number"
                        className="bg-white/5 border-white/10"
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Deadline *
                    </label>
                    <Input
                      type="date"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Project Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter project location"
                      className="pl-10 bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Equipment Needed
                  </label>
                  <Textarea
                    placeholder="List required equipment (e.g., Excavators - 3 units, Bulldozers - 2 units)"
                    className="min-h-[100px] bg-white/5 border-white/10 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Upload Project Images
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
                    <p className="text-sm text-white mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowPostForm(false)}
                    className="flex-1 border-white/20"
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1 gradient-gold text-[#0B0B0D]">
                    Post Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Project Feed */
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass-effect rounded-xl overflow-hidden hover:shadow-luxury transition-all"
              >
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Project Image */}
                  <div className="lg:col-span-1">
                    <div className="relative h-full min-h-[250px]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 glass-effect rounded-full text-xs font-semibold text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {project.distance}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="glass-effect rounded-lg p-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Bids</span>
                            <span className="text-white font-semibold">
                              {project.bids} received
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="lg:col-span-2 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{project.postedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Posted {project.postedDate}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {project.description}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-muted-foreground mb-1">Budget</p>
                        <p className="text-xl font-bold text-primary mb-3">
                          {project.budget}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{project.deadline}</span>
                        </div>
                      </div>
                    </div>

                    {/* Equipment Needed */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2">
                        Equipment Required
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.equipmentNeeded.map((equipment, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/5 rounded-full text-xs text-muted-foreground"
                          >
                            {equipment}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button className="gradient-gold text-[#0B0B0D]">
                        {userRole === "vendor" ? "Submit Bid" : "View Bids"}
                      </Button>
                      <Button variant="outline" className="border-white/20">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Sample Bids Section (shown when viewing a specific project) */}
            {userRole === "client" && (
              <div className="glass-effect rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Received Bids
                </h2>
                <div className="space-y-4">
                  {sampleBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="p-5 bg-white/5 rounded-lg border border-white/10 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-white">{bid.vendorName}</h4>
                            <span className="px-2 py-1 glass-effect rounded-full text-xs font-semibold text-white flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {bid.distance}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-primary text-primary" />
                              <span>{bid.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{bid.completedProjects} projects completed</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Bid Amount</p>
                          <p className="text-2xl font-bold text-primary">{bid.bidAmount}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Timeline: {bid.timeline}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {bid.message}
                      </p>
                      <div className="flex gap-3">
                        <Button size="sm" className="gradient-gold text-[#0B0B0D]">
                          Accept Bid
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20">
                          Message Vendor
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
