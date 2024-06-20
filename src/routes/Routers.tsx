import { Suspense, useEffect, useRef } from 'react'
import {
  Navigate,
  Route,
  Routes as RoutesReactRouterDom,
} from 'react-router-dom'
import { Question, GenericNotFound } from './paths'
import { useGSAP } from '@gsap/react';
import gsap from "gsap";

export const Routes = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
        gsap.to(".bg-path1", {
            rotate: 360,
            duration: 10,
            repeat: -1,
            ease: "none",
        });
        gsap.to(".bg-path2", {
            rotate: 360,
            duration: 15,
            repeat: -1,
            ease: "none",
        });
    },
    { scope: container }
);

  return (
    <div
    className="fullscreen"
    ref={container}
    style={{ overflow: "auto" }}
>
    <div className="bg-path1"></div>
    <div className="bg-path2"></div>
    <Suspense fallback={<p>carregando</p>}>
      <RoutesReactRouterDom>
        <Route  path="/"  element={<Question />} />
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/404" element={<GenericNotFound />} />
      </RoutesReactRouterDom>
    </Suspense>
    </div>
  )
}