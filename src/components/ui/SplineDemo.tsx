'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
 
export function SplineSceneBasic({ children }: { children?: React.ReactNode }) {
  return (
    <Card className="w-full min-h-[500px] lg:h-[500px] bg-black/[0.96] relative overflow-hidden flex flex-col lg:block">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col lg:flex-row h-full flex-1">
        {/* Left content */}
        <div className="flex-1 p-6 sm:p-8 relative z-10 flex flex-col justify-center order-2 lg:order-1 pb-10 lg:pb-8">
          {children}
        </div>

        {/* Right content */}
        <div className="w-full h-[300px] lg:h-auto lg:flex-1 relative order-1 lg:order-2">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
