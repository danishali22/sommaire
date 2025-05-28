"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import NavigationControls from "./navigation-controls";
import { set } from "date-fns";
import ProgressBar from "./progress-bar";

const parseSection = (section: string) => {
  const [title, ...content] = section.split("\n");
  const cleanedTitle = title.startsWith("#")
    ? title.substring(1).trim()
    : title.trim();

  const points: String[] = [];
  let currentPoint = "";

  content.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine === "") return;
    if (trimmedLine.startsWith("•")) {
      if (currentPoint) {
        points.push(currentPoint.trim());
      }
      currentPoint = line.substring(2).trim();
    } else if (!trimmedLine) {
      if (currentPoint) {
        points.push(currentPoint.trim());
        currentPoint = "";
      }
    } else {
      currentPoint += " " + trimmedLine;
    }
  });

  if (currentPoint) {
    points.push(currentPoint.trim());
  }

  return {
    title: cleanedTitle,
    points: points.filter(
      (point) => point && !point.startsWith("#") && !point.startsWith("[Choose")
    ),
  };
};

const SummaryViewer = ({ summary }: { summary: string }) => {
  const [currentSection, setCurrentSection] = useState(0);

  const handleNext = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  const handlePrevious = () =>
    setCurrentSection((prev) => Math.max(prev - 1, 0));

  const sections = summary
    .split("\n# ")
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseSection);
  return (
    <Card className="relative px-2 h-[500px] sm:h-[600px] lg:h-[700px] w-full xl:w-[600px] overflow-hiddne bg-linear-to-r  from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-500/10">
      <ProgressBar sections={sections} currentSection={currentSection} />
      <div className="h-full overflow-y-auto scrollbar-hide pt-12 sm:pt-16 pb-20 sm:pb-24">
        <div className="px-4 sm:px-6">
          <h2>{sections[currentSection]?.title || ""}</h2>
          <ul>
            {sections[currentSection]?.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
      <NavigationControls
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSelectionSelect={setCurrentSection}
      />
    </Card>
  );
};

export default SummaryViewer;
