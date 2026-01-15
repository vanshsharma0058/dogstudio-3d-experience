import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  useAnimations,
} from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Dog = () => {
  gsap.registerPlugin(useGSAP);
  gsap.registerPlugin(ScrollTrigger);

  const model = useGLTF("/model/dog.drc.glb"); //load the model in component

  useThree(({ camera, scene, gl }) => {
    camera.position.z = 0.59;
    // this is for enchance the quality of renderer
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });
  // How to use animation to dog
  const { actions } = useAnimations(model.animations, model.scene);

  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  //     it is for texture
  //   const textures = useTexture({
  //     normalMap: "/dog_normals.jpg",
  //     sampleMatCap: "/matcap/mat-2.png",
  //   });
  const [normalMap, sampleMatCap] = useTexture([
    "/dog_normals.jpg",
    "/matcap/mat-2.png",
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const [branchMap, branchNormalMap] = useTexture([
    "/branches_diffuse.jpeg",
    "/branches_normals.jpeg",
  ]).map((texture) => {
    texture.flipY = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const dogMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: sampleMatCap,
  });

  const branchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    map: branchMap,
  });

  //it is use for apply the texture
  useEffect(() => {
    model.scene.traverse((child) => {
      if (child.name.includes("DOG")) {
        child.material = dogMaterial;
      } else {
        child.material = branchMaterial;
      }
    });
  }, [model.scene, normalMap, sampleMatCap]);
  //   useEffect(() => {
  //     scene.traverse((child) => {
  //       if (child.isMesh) {
  //         child.material.normalMap = textures.normalMap;
  //         child.material.needsUpdate = true;
  //       }
  //     });
  //   }, [scene, textures]);

  const dogmodel = useRef(model);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-1",
        endTrigger: "#section-3",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: true,
      },
    });
    tl.to(dogmodel.current.scene.position, {
      z: "-=0.75",
      y: "+=0.1",
    })
      .to(dogmodel.current.scene.rotation, {
        x: `+=${Math.PI / 15}`,
      })
      .to(
        dogmodel.current.scene.rotation,
        {
          y: `-=${Math.PI}`,
        },
        "third"
      )
      .to(
        dogmodel.current.scene.position,
        {
          x: "-=0.5",
          z: "+=0.6",
          y: "-=0.05",
        },
        "third"
      );
  }, []);

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.2, -0.55, 0]}
        rotation={[0, Math.PI / 3.7, 0]}
      />
      {/* add the model in threejs */}
      <directionalLight position={[5, 5, 5]} intensity={10} />
    </>
  );
};

export default Dog;
