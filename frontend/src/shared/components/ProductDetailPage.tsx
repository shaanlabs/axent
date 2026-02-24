import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Shield,
  Clock,
  Phone,
  MessageSquare,
  Heart,
  Share2,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";

export function ProductDetailPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [offerAmount, setOfferAmount] = useState("");

  const images = [
    "https://images.unsplash.com/photo-1759950345011-ee5a96640e00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGNhdmF0b3IlMjBjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3MTA5ODMyNHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1603814744174-115311ad645e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBidWxsZG96ZXIlMjBoZWF2eSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzEwOTgzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1659449082344-53f79e1e4198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3dlciUyMGNyYW5lJTIwY29uc3RydWN0aW9uJTIwc2t5bGluZXxlbnwxfHx8fDE3NzEwOTgzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  const specifications = [
    { label: "Operating Weight", value: "20,500 kg" },
    { label: "Engine Power", value: "121 HP" },
    { label: "Bucket Capacity", value: "0.9 m³" },
    { label: "Max Digging Depth", value: "6.7 m" },
    { label: "Max Reach", value: "10.1 m" },
    { label: "Year", value: "2021" },
    { label: "Hours Used", value: "1,850 hrs" },
    { label: "Fuel Type", value: "Diesel" },
  ];

  const features = [
    "GPS Tracking System",
    "Climate Controlled Cab",
    "Hydraulic Thumb Attachment",
    "Backup Camera",
    "LED Work Lights",
    "Bluetooth Audio System",
    "Auto Idle System",
    "Safety Certified 2024",
  ];

  const reviews = [
    {
      name: "Michael Rodriguez",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent machine! Used it for a 3-week foundation project. Operator was professional and the equipment was in perfect condition.",
      verified: true,
    },
    {
      name: "Sarah Construction Co.",
      rating: 5,
      date: "1 month ago",
      comment: "We've rented from this dealer multiple times. Always reliable, well-maintained equipment and great customer service.",
      verified: true,
    },
    {
      name: "David Chen",
      rating: 4,
      date: "2 months ago",
      comment: "Good performance overall. Minor delay in delivery but equipment quality was top-notch. Would rent again.",
      verified: true,
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/marketplace")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="glass-effect rounded-2xl overflow-hidden">
              <img
                src={images[selectedImage]}
                alt="Equipment"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`glass-effect rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                    ? "border-primary"
                    : "border-transparent hover:border-white/20"
                    }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-teal rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3 text-white" />
                      <span className="text-xs font-semibold text-white">
                        Verified Seller
                      </span>
                    </span>
                    <span className="px-3 py-1 bg-primary rounded-full text-xs font-semibold text-[#0B0B0D]">
                      Available Now
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    CAT 320 Excavator
                  </h1>
                  <p className="text-muted-foreground">
                    Caterpillar • Model 320D2L
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="text-lg font-bold text-white">4.8</span>
                </div>
                <span className="text-muted-foreground">124 reviews</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Houston, TX</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="glass-effect rounded-xl p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Rental Price
                  </p>
                  <p className="text-3xl font-bold text-primary mb-1">₹25,000</p>
                  <p className="text-sm text-muted-foreground">per day</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Weekly: <span className="text-white font-semibold">₹1,65,000</span>
                    </p>
                    <p className="text-muted-foreground">
                      Monthly: <span className="text-white font-semibold">₹6,50,000</span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Purchase Price
                  </p>
                  <p className="text-3xl font-bold text-white mb-1">₹85 Lakh</p>
                  <p className="text-sm text-muted-foreground">negotiable</p>
                  <div className="mt-3">
                    <p className="text-sm text-teal flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Good price for this condition
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full gradient-gold text-[#0B0B0D] h-12 shadow-glow-gold">
                Book for Rent
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-white/20 h-12">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Owner
                </Button>
                <Button variant="outline" className="border-white/20 h-12">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat Now
                </Button>
              </div>
            </div>

            {/* Make Offer */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">
                Want to Bargain? Make Your Offer
              </h3>
              <div className="flex gap-3">
                <Input
                  placeholder="₹ Your offer (e.g., ₹22,000)"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
                <Button className="gradient-blue">
                  Send Offer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Owner will see your offer and may accept or send a counter-price. Worth trying!
              </p>
            </div>

            {/* Owner Info */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#0B0B0D]">HC</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">
                    Houston Construction Equipment
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      4.9 rating
                    </span>
                    <span>285 rentals</span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-teal" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="glass-effect rounded-xl p-6 border-2 border-primary/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#0B0B0D]" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Based on your recent project estimation, this equipment is a{" "}
                    <span className="text-primary font-semibold">95% match</span>{" "}
                    for your excavation requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="glass-effect p-1">
              <TabsTrigger value="specs">Technical Specifications</TabsTrigger>
              <TabsTrigger value="features">Features & Amenities</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              <div className="glass-effect rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Technical Specifications
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {specifications.map((spec) => (
                    <div key={spec.label} className="p-4 bg-white/5 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        {spec.label}
                      </p>
                      <p className="text-lg font-bold text-white">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <div className="glass-effect rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Features & Amenities
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 p-4 bg-white/5 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-teal flex-shrink-0" />
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="glass-effect rounded-xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Customer Reviews
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-primary text-primary" />
                        <span className="text-2xl font-bold text-white">4.8</span>
                      </div>
                      <span className="text-muted-foreground">
                        Based on 124 reviews
                      </span>
                    </div>
                  </div>
                  <Button className="gradient-gold text-[#0B0B0D]">
                    Write a Review
                  </Button>
                </div>

                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className="p-6 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold">
                              {review.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-white">
                                {review.name}
                              </h4>
                              {review.verified && (
                                <Shield className="w-4 h-4 text-teal" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-primary text-primary"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
