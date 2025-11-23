```
import React from 'react';
import { Star, Clock, Map, ChevronRight } from 'lucide-react';

const BusCard = ({ bus }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
      <div className="md:flex">
        <div className="md:flex-shrink-0 relative">
          <img
            className="h-48 w-full md:w-48 object-cover"
            src={bus.image}
            alt={bus.name}
          />
          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
            <span className="text-xs font-bold text-white tracking-wider uppercase">{bus.routeNo}</span>
          </div>
        </div>
        <div className="p-6 w-full relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-display font-bold text-white leading-tight mb-1 group-hover:text-brand-accent transition-colors">
                {bus.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-yellow-500/20 px-2 py-0.5 rounded-md border border-yellow-500/30">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="ml-1 text-xs font-bold text-yellow-400">
                    {bus.rating}
                  </span>
                </div>
                <span className="text-xs text-slate-400">({bus.totalRatings} reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Starting from</span>
              <p className="text-xl font-bold text-brand-accent">৳{bus.fare.base}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-700/50 rounded-lg">
                <Map className="h-4 w-4 text-brand-primary" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Route</p>
                <p className="text-sm font-medium text-slate-200">
                  {bus.source} <span className="text-slate-500 mx-1">→</span> {bus.destination}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-700/50 rounded-lg">
                <Clock className="h-4 w-4 text-brand-violet" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Est. Time</p>
                <p className="text-sm font-medium text-slate-200">45-60 mins</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-slate-700/50 pt-4">
            <button className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors group/btn">
              View Details
              <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
```
