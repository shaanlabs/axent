import { Leaf, MapPin, Star, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AgriculturePage() {
  const categories = [
    {
      name: "Tractors",
      icon: "🚜",
      count: "1,240+",
      description: "All types and sizes",
    },
    {
      name: "Harvesters",
      icon: "🌾",
      count: "680+",
      description: "Combine & specialized",
    },
    {
      name: "Rotavators",
      icon: "⚙️",
      count: "890+",
      description: "Soil preparation",
    },
    {
      name: "Seeders",
      icon: "🌱",
      count: "520+",
      description: "Planting equipment",
    },
    {
      name: "Sprayers",
      icon: "💧",
      count: "420+",
      description: "Crop protection",
    },
    {
      name: "Implements",
      icon: "🔧",
      count: "1,050+",
      description: "Various attachments",
    },
  ];

  const equipment = [
    {
      id: 1,
      name: "John Deere 5075E Tractor",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      category: "Tractor",
      dailyRate: "$220",
      salePrice: "$48,000",
      location: "Austin, TX",
      distance: "4.2 km",
      rating: 4.9,
      available: true,
    },
    {
      id: 2,
      name: "Massey Ferguson 9545 Combine",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      category: "Harvester",
      dailyRate: "$650",
      salePrice: "$185,000",
      location: "Dallas, TX",
      distance: "6.8 km",
      rating: 4.8,
      available: true,
    },
    {
      id: 3,
      name: "Rotavator 6.5ft Heavy Duty",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      category: "Rotavator",
      dailyRate: "$85",
      salePrice: "$8,500",
      location: "Houston, TX",
      distance: "2.1 km",
      rating: 4.7,
      available: true,
    },
    {
      id: 4,
      name: "Precision Seed Drill 24-Row",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      category: "Seeder",
      dailyRate: "$180",
      salePrice: "$22,000",
      location: "San Antonio, TX",
      distance: "8.5 km",
      rating: 4.6,
      available: true,
    },
    {
      id: 5,
      name: "Boom Sprayer 3000L",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      category: "Sprayer",
      dailyRate: "$145",
      salePrice: "$18,500",
      location: "Fort Worth, TX",
      distance: "5.3 km",
      rating: 4.8,
      available: true,
    },
    {
      id: 6,
      name: "Multi-Purpose Cultivator",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      category: "Implement",
      dailyRate: "$95",
      salePrice: "$9,800",
      location: "Austin, TX",
      distance: "3.7 km",
      rating: 4.7,
      available: true,
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect mb-6">
            <Leaf className="w-3 h-3 text-teal" />
            <span className="text-xs text-muted-foreground">
              Agriculture Equipment Marketplace
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Farm Machinery & Equipment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find tractors, harvesters, and specialized farming equipment near you
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-effect rounded-xl p-4 mb-12 max-w-3xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search farm equipment..."
                className="pl-12 bg-white/5 border-white/10 h-12"
              />
            </div>
            <Button className="gradient-teal text-[#0B0B0D] px-8">
              Search
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className="glass-effect rounded-xl p-6 hover:shadow-luxury transition-all group text-center"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {category.description}
                </p>
                <p className="text-sm font-semibold text-primary">
                  {category.count}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Equipment */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Available Equipment Nearby
            </h2>
            <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white">
              <option>Nearest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating: High to Low</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <Link
                key={item.id}
                to="/marketplace"
                className="glass-effect rounded-xl overflow-hidden hover:shadow-luxury transition-all group text-left block"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal/20 to-transparent">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-50">{categories.find(c => c.name.includes(item.category.split(' ')[0]))?.icon}</div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-teal rounded-full text-xs font-semibold text-white">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 glass-effect rounded-full text-xs font-semibold text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.distance}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-primary/90 rounded text-xs font-semibold text-[#0B0B0D]">
                      Available
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-semibold text-white">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-3 border-t border-white/10 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Rent</p>
                      <p className="text-lg font-bold text-teal">
                        {item.dailyRate}/day
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Buy</p>
                      <p className="text-sm font-semibold text-white">
                        {item.salePrice}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" className="border-white/20">
              Previous
            </Button>
            {[1, 2, 3, 4].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                className={page === 1 ? "gradient-teal text-[#0B0B0D]" : "border-white/20"}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="border-white/20">
              Next
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 glass-effect rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help Finding the Right Equipment?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our AI can analyze your farm requirements and recommend the best equipment for your needs
          </p>
          <Link to="/ai-estimator">
            <Button
              className="gradient-teal text-[#0B0B0D] px-8 h-12"
            >
              <Leaf className="w-5 h-5 mr-2" />
              Use AI Estimator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
