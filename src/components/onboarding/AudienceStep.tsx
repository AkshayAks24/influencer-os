import { useState } from "react";
import { motion } from "framer-motion";
import { OnboardingLayout } from "./OnboardingLayout";
import { SelectableCard } from "./SelectableCard";
import onboardingData from "@/data/onboarding.json";

interface AudienceStepProps {
  audiences: string[];
  location: string;
  languages: string[];
  onUpdate: (audiences: string[], location: string, languages: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AudienceStep({
  audiences,
  location,
  languages,
  onUpdate,
  onNext,
  onBack,
}: AudienceStepProps) {
  const [loc, setLoc] = useState(location);
  const [locSearch, setLocSearch] = useState(location);
  const [showLocDropdown, setShowLocDropdown] = useState(false);

  const toggleAudience = (id: string) => {
    const updated = audiences.includes(id)
      ? audiences.filter((a) => a !== id)
      : [...audiences, id];
    onUpdate(updated, loc, languages);
  };

  const toggleLanguage = (id: string) => {
    const updated = languages.includes(id)
      ? languages.filter((l) => l !== id)
      : [...languages, id];
    onUpdate(audiences, loc, updated);
  };

  const filteredLocations = onboardingData.locations.filter((l) =>
    l.toLowerCase().includes(locSearch.toLowerCase())
  );

  const isValid = audiences.length > 0 && loc.length > 0 && languages.length > 0;

  return (
    <OnboardingLayout
      step="audience"
      stepIndex={1}
      totalSteps={7}
      heading="Who are you creating for?"
      onBack={onBack}
      footer={
        <motion.button
          className={`w-full py-3.5 rounded-full font-heading font-bold text-base transition-all ${
            isValid
              ? "bg-pulse-text text-pulse-white hover:bg-pulse-text/90 shadow-lg"
              : "bg-pulse-elevated text-pulse-muted cursor-not-allowed"
          }`}
          whileTap={isValid ? { scale: 0.97 } : {}}
          onClick={() => isValid && onNext()}
        >
          Continue
        </motion.button>
      }
    >
      {/* Audience multi-select */}
      <div className="grid grid-cols-2 gap-2.5">
        {onboardingData.audiences.map((aud) => (
          <SelectableCard
            key={aud.id}
            emoji={aud.emoji}
            label={aud.label}
            selected={audiences.includes(aud.id)}
            onClick={() => toggleAudience(aud.id)}
            size="sm"
          />
        ))}
      </div>

      {/* Location */}
      <div className="mt-6">
        <label className="text-xs font-heading font-bold uppercase tracking-wider text-pulse-muted mb-2 block">
          Location
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search your location..."
            value={locSearch}
            onChange={(e) => {
              setLocSearch(e.target.value);
              setShowLocDropdown(true);
            }}
            onFocus={() => setShowLocDropdown(true)}
            className="w-full px-4 py-3 rounded-xl border border-pulse-border bg-pulse-card text-pulse-text font-body placeholder:text-pulse-muted focus:outline-none focus:border-pulse-text/40 transition-colors"
          />
          {showLocDropdown && locSearch.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-pulse-card border border-pulse-border rounded-xl shadow-lg z-20 max-h-40 overflow-y-auto">
              {filteredLocations.map((l) => (
                <button
                  key={l}
                  className={`w-full text-left px-4 py-2.5 text-sm font-body hover:bg-pulse-elevated transition-colors first:rounded-t-xl last:rounded-b-xl ${
                    loc === l ? "text-pulse-text font-semibold bg-pulse-elevated" : "text-pulse-muted"
                  }`}
                  onClick={() => {
                    setLoc(l);
                    setLocSearch(l);
                    setShowLocDropdown(false);
                    onUpdate(audiences, l, languages);
                  }}
                >
                  {l}
                </button>
              ))}
              {filteredLocations.length === 0 && (
                <p className="px-4 py-2.5 text-sm font-body text-pulse-muted">No results</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Languages */}
      <div className="mt-6">
        <label className="text-xs font-heading font-bold uppercase tracking-wider text-pulse-muted mb-2 block">
          Languages
        </label>
        <div className="flex flex-wrap gap-2">
          {onboardingData.languages.map((lang) => (
            <motion.button
              key={lang.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-body font-medium border transition-all ${
                languages.includes(lang.id)
                  ? "bg-pulse-text text-pulse-white border-pulse-text"
                  : "bg-pulse-card text-pulse-text border-pulse-border hover:border-pulse-text/30"
              }`}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleLanguage(lang.id)}
            >
              <span className="text-xs">{lang.emoji}</span>
              {lang.label}
            </motion.button>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
}
