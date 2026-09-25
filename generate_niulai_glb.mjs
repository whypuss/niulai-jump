import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';

// Mock FileReader for Node.js environment
class MockFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
}
globalThis.FileReader = MockFileReader;

console.log("Creating 3D Niulai Cow model with full 3D facial & body geometry...");

function buildNiulaiCow() {
  const root = new THREE.Group();
  root.name = "Niulai_Cow";

  // 調色盤（完全還原第二張圖片）
  const matFur = new THREE.MeshStandardMaterial({
    name: "Yellow_Fur",
    color: 0xe0a62f, // 暖黃色/芥末黃連身皮套
    roughness: 0.82,
    metalness: 0.04
  });

  const matSnout = new THREE.MeshStandardMaterial({
    name: "Pink_Purple_Muzzle",
    color: 0xc4a3b3, // 標誌性粉肉紫灰色厚吻部
    roughness: 0.55,
    metalness: 0.02
  });

  const matHorn = new THREE.MeshStandardMaterial({
    name: "Dark_Horn",
    color: 0x363233, // 深灰黑角
    roughness: 0.5,
    metalness: 0.15
  });

  const matHoof = new THREE.MeshStandardMaterial({
    name: "Grey_Hoof",
    color: 0xd2cbd2, // 蹄部淺灰白色
    roughness: 0.65,
    metalness: 0.08
  });

  const matEyeWhite = new THREE.MeshStandardMaterial({
    name: "Eye_White",
    color: 0xf5efe8,
    roughness: 0.3
  });

  const matEyePupil = new THREE.MeshStandardMaterial({
    name: "Eye_Pupil",
    color: 0x161312,
    roughness: 0.4
  });

  const matEyeBrow = new THREE.MeshStandardMaterial({
    name: "Black_Eyebrow",
    color: 0x1a1716,
    roughness: 0.7
  });

  const matDarkDetail = new THREE.MeshStandardMaterial({
    name: "Dark_Detail",
    color: 0x242020,
    roughness: 0.9
  });

  const matInnerEar = new THREE.MeshStandardMaterial({
    name: "Inner_Ear",
    color: 0xd9b3bd,
    roughness: 0.7
  });

  // 1. 軀幹 (Body & Belly)
  const bodyGroup = new THREE.Group();
  bodyGroup.name = "Body";

  // 主身軀
  const bodyGeo = new THREE.CylinderGeometry(0.72, 0.82, 1.45, 24);
  const bodyMesh = new THREE.Mesh(bodyGeo, matFur);
  bodyMesh.name = "Torso";
  bodyMesh.position.y = 1.45;
  bodyGroup.add(bodyMesh);

  // 圓滾凸起的肚腩
  const bellyGeo = new THREE.SphereGeometry(0.78, 20, 16);
  const bellyMesh = new THREE.Mesh(bellyGeo, matFur);
  bellyMesh.name = "Belly";
  bellyMesh.scale.set(1.0, 0.92, 1.14);
  bellyMesh.position.set(0, 1.36, 0.08);
  bodyGroup.add(bellyMesh);

  // 2. 頭部 (Head)
  const headGroup = new THREE.Group();
  headGroup.name = "Head";
  headGroup.position.set(0, 2.35, 0.05);

  const headGeo = new THREE.SphereGeometry(0.76, 24, 20);
  const headMesh = new THREE.Mesh(headGeo, matFur);
  headMesh.name = "Head_Skull";
  headMesh.scale.set(1.02, 1.05, 1.05);
  headGroup.add(headMesh);

  // 3. 標誌性前凸大嘴吻部 (Muzzle / Snout)
  const snoutGroup = new THREE.Group();
  snoutGroup.name = "Muzzle_Snout";
  snoutGroup.position.set(0, -0.14, 0.58);

  const snoutMainGeo = new THREE.SphereGeometry(0.52, 20, 16);
  const snoutMain = new THREE.Mesh(snoutMainGeo, matSnout);
  snoutMain.scale.set(1.15, 0.72, 1.05);
  snoutGroup.add(snoutMain);

  // 上唇飽滿厚實
  const upperLipGeo = new THREE.CylinderGeometry(0.46, 0.52, 0.28, 16);
  const upperLip = new THREE.Mesh(upperLipGeo, matSnout);
  upperLip.rotation.x = Math.PI / 10;
  upperLip.position.set(0, 0.08, 0.12);
  snoutGroup.add(upperLip);

  // 鼻孔 (Nostrils)
  for (let side of [-1, 1]) {
    const nostrilGeo = new THREE.SphereGeometry(0.065, 10, 8);
    const nostril = new THREE.Mesh(nostrilGeo, matDarkDetail);
    nostril.name = side === -1 ? "Nostril_L" : "Nostril_R";
    nostril.scale.set(1.4, 0.8, 1.0);
    nostril.position.set(side * 0.16, 0.12, 0.46);
    snoutGroup.add(nostril);
  }

  // 下唇
  const lowerLipGeo = new THREE.CylinderGeometry(0.36, 0.32, 0.15, 12);
  const lowerLip = new THREE.Mesh(lowerLipGeo, matSnout);
  lowerLip.position.set(0, -0.18, 0.18);
  snoutGroup.add(lowerLip);

  headGroup.add(snoutGroup);

  // 4. 靈魂面部器官：純 3D 厭世蔑視「死魚眼」與挑眉
  for (let side of [-1, 1]) {
    const eyeGroup = new THREE.Group();
    eyeGroup.name = side === -1 ? "Eye_L" : "Eye_R";
    eyeGroup.position.set(side * 0.32, 0.22, 0.65);

    // 4.1 眼白 (Eyeball Base) - 扁橢圓
    const eyeballGeo = new THREE.SphereGeometry(0.18, 16, 12);
    const eyeball = new THREE.Mesh(eyeballGeo, matEyeWhite);
    eyeball.scale.set(1.25, 0.85, 0.6);
    eyeGroup.add(eyeball);

    // 4.2 黑色小瞳孔 (Pupil) - 微斜視
    const pupilGeo = new THREE.SphereGeometry(0.075, 12, 10);
    const pupil = new THREE.Mesh(pupilGeo, matEyePupil);
    pupil.position.set(side * 0.04, 0.01, 0.09);
    eyeGroup.add(pupil);

    // 4.3 靈魂死魚眼皮 (Drooping Upper Eyelid)
    // 黃色眼皮半耷拉遮住上眼球 40%，形成厭世蔑視神態
    const eyelidGeo = new THREE.SphereGeometry(0.19, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const eyelid = new THREE.Mesh(eyelidGeo, matFur);
    eyelid.scale.set(1.28, 0.88, 0.62);
    eyelid.rotation.x = Math.PI / 8;
    eyelid.position.set(0, 0.04, 0.02);
    eyeGroup.add(eyelid);

    // 4.4 黑色挑眉 (Eyebrow)
    const browGeo = new THREE.BoxGeometry(0.38, 0.08, 0.08);
    const brow = new THREE.Mesh(browGeo, matEyeBrow);
    brow.position.set(0, 0.22, 0.05);
    brow.rotation.z = side * -0.22; // 眉梢外挑微揚，傲慢挑釁神態
    brow.rotation.y = side * 0.15;
    eyeGroup.add(brow);

    headGroup.add(eyeGroup);
  }

  // 5. 牛角 (Horns)
  for (let side of [-1, 1]) {
    const hornGroup = new THREE.Group();
    hornGroup.name = side === -1 ? "Horn_L" : "Horn_R";
    hornGroup.position.set(side * 0.48, 0.62, -0.05);

    const hornGeo = new THREE.ConeGeometry(0.14, 0.58, 16);
    const hornMesh = new THREE.Mesh(hornGeo, matHorn);
    hornMesh.position.y = 0.26;
    hornMesh.rotation.z = side * -0.55;
    hornMesh.rotation.x = -0.35;
    hornGroup.add(hornMesh);

    const ringGeo = new THREE.CylinderGeometry(0.15, 0.16, 0.08, 12);
    const ringMesh = new THREE.Mesh(ringGeo, matHorn);
    ringMesh.position.set(0, 0.02, 0);
    hornGroup.add(ringMesh);

    headGroup.add(hornGroup);
  }

  // 6. 牛耳朵 (Ears) - 扁平下垂
  for (let side of [-1, 1]) {
    const earGroup = new THREE.Group();
    earGroup.name = side === -1 ? "Ear_L" : "Ear_R";
    earGroup.position.set(side * 0.68, 0.42, -0.1);

    const earGeo = new THREE.SphereGeometry(0.28, 16, 12);
    const earMesh = new THREE.Mesh(earGeo, matFur);
    earMesh.scale.set(0.9, 0.4, 0.25);
    earMesh.rotation.z = side * 0.35;
    earMesh.rotation.y = side * 0.25;
    earGroup.add(earMesh);

    const innerEarGeo = new THREE.SphereGeometry(0.2, 12, 10);
    const innerEarMesh = new THREE.Mesh(innerEarGeo, matInnerEar);
    innerEarMesh.scale.set(0.8, 0.3, 0.15);
    innerEarMesh.position.set(0, 0, 0.05);
    earGroup.add(innerEarMesh);

    headGroup.add(earGroup);
  }

  bodyGroup.add(headGroup);

  // 7. 手臂與分趾蹄手 (Arms & Hands)
  for (let side of [-1, 1]) {
    const armGroup = new THREE.Group();
    armGroup.name = side === -1 ? "Arm_L" : "Arm_R";
    armGroup.position.set(side * 0.88, 1.75, 0);

    const armGeo = new THREE.CylinderGeometry(0.22, 0.2, 0.75, 16);
    const armMesh = new THREE.Mesh(armGeo, matFur);
    armMesh.position.y = -0.35;
    armMesh.rotation.z = side * -0.15;
    armGroup.add(armMesh);

    const handGeo = new THREE.BoxGeometry(0.28, 0.24, 0.28);
    const handMesh = new THREE.Mesh(handGeo, matHoof);
    handMesh.position.set(0, -0.78, 0);
    armGroup.add(handMesh);

    bodyGroup.add(armGroup);
  }

  // 8. 雙腿與分趾蹄腳 (Legs & Hooves)
  for (let side of [-1, 1]) {
    const legGroup = new THREE.Group();
    legGroup.name = side === -1 ? "Leg_L" : "Leg_R";
    legGroup.position.set(side * 0.36, 0.75, 0);

    const legGeo = new THREE.CylinderGeometry(0.26, 0.28, 0.65, 16);
    const legMesh = new THREE.Mesh(legGeo, matFur);
    legMesh.position.y = -0.22;
    legGroup.add(legMesh);

    const hoofGeo = new THREE.BoxGeometry(0.36, 0.22, 0.48);
    const hoofMesh = new THREE.Mesh(hoofGeo, matHoof);
    hoofMesh.position.set(0, -0.62, 0.06);
    legGroup.add(hoofMesh);

    // 蹄中分線
    const splitGeo = new THREE.BoxGeometry(0.04, 0.24, 0.25);
    const splitMesh = new THREE.Mesh(splitGeo, matDarkDetail);
    splitMesh.position.set(0, -0.62, 0.18);
    legGroup.add(splitMesh);

    bodyGroup.add(legGroup);
  }

  // 9. 尾巴 (Tail)
  const tailGroup = new THREE.Group();
  tailGroup.name = "Tail";
  tailGroup.position.set(0, 0.9, -0.75);

  const tailGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.45, 8);
  const tailMesh = new THREE.Mesh(tailGeo, matFur);
  tailMesh.position.set(0, -0.2, -0.1);
  tailMesh.rotation.x = -0.55;
  tailGroup.add(tailMesh);

  const tuftGeo = new THREE.SphereGeometry(0.09, 10, 8);
  const tuftMesh = new THREE.Mesh(tuftGeo, matDarkDetail);
  tuftMesh.position.set(0, -0.42, -0.22);
  tailGroup.add(tuftMesh);

  bodyGroup.add(tailGroup);

  root.add(bodyGroup);
  return root;
}

const cowModel = buildNiulaiCow();
const exporter = new GLTFExporter();

exporter.parse(
  cowModel,
  (glb) => {
    const outFile = 'niulai_cow.glb';
    fs.writeFileSync(outFile, Buffer.from(glb));
    console.log(`✅ SUCCESS! Exported full 3D Niulai Cow model to ${outFile}`);
    console.log(`File size: ${(glb.byteLength / 1024).toFixed(2)} KB (${glb.byteLength} bytes)`);
  },
  (err) => {
    console.error("❌ Failed to export GLB:", err);
  },
  { binary: true }
);
