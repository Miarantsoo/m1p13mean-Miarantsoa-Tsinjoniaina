import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface ShopClickEvent {
  name: string;
  mesh: THREE.Mesh;
  screenX: number;
  screenY: number;
}

@Component({
  selector: 'app-shop-visualization',
  standalone: false,
  templateUrl: './shop-visualization.component.html',
  styleUrl: './shop-visualization.component.scss',
})
export class ShopVisualizationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Output() shopClicked = new EventEmitter<ShopClickEvent>();

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animFrameId!: number;
  private resizeObserver!: ResizeObserver;
  private ctrlListener!: (e: KeyboardEvent) => void;

  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private shopMeshes: THREE.Mesh[] = [];
  private hoveredMesh: THREE.Mesh | null = null;
  private selectedMesh: THREE.Mesh | null = null;
  private originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();

  // UI state
  selectedShop: ShopClickEvent | null = null;
  hoveredShopName: string | null = null;
  tooltipX = 0;
  tooltipY = 0;

  // Mouse move / click listeners
  private mouseMoveListener!: (e: MouseEvent) => void;
  private clickListener!: (e: MouseEvent) => void;
  private mouseDownPos = { x: 0, y: 0 };
  private mouseDownListener!: (e: MouseEvent) => void;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initThree();
    this.loadModel();
    this.startRender();
    this.listenResize();
    this.listenCtrl();
    this.listenMouse();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
    this.resizeObserver?.disconnect();
    this.controls?.dispose();
    this.renderer?.dispose();
    document.removeEventListener('keydown', this.ctrlListener);
    document.removeEventListener('keyup', this.ctrlListener);
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      canvas.removeEventListener('mousemove', this.mouseMoveListener);
      canvas.removeEventListener('click', this.clickListener);
      canvas.removeEventListener('mousedown', this.mouseDownListener);
    }
  }

  private getSize(): { w: number; h: number } {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement!;
    const rect = parent.getBoundingClientRect();
    return {
      w: rect.width || canvas.clientWidth || 800,
      h: rect.height || canvas.clientHeight || 600,
    };
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const { w, h } = this.getSize();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 5000);
    this.camera.position.set(0, 10, 10);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(w, h, false);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.screenSpacePanning = true;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
  }

  private loadModel(): void {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      'mall.glb',
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        this.scene.add(model);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            this.shopMeshes.push(mesh);
            // Sauvegarder le matériau original
            this.originalMaterials.set(
              mesh,
              Array.isArray(mesh.material)
                ? mesh.material.map((m) => m.clone())
                : mesh.material.clone()
            );
          }
        });

        const newBox = new THREE.Box3().setFromObject(model);
        const size = newBox.getSize(new THREE.Vector3());
        const newCenter = newBox.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = THREE.MathUtils.degToRad(this.camera.fov);
        const aspect = this.camera.aspect;
        const fovH = 2 * Math.atan(Math.tan(fov / 2) * aspect);
        const dist = (maxDim / 2) / Math.tan(Math.min(fov, fovH) / 2) * 0.8;

        const dir = new THREE.Vector3(0, 89, 100).normalize();
        this.camera.position.copy(dir.multiplyScalar(dist).add(newCenter));
        this.camera.lookAt(newCenter);
        model.position.y = 20;

        this.controls.target.copy(newCenter);
        this.controls.maxDistance = dist;
        this.controls.update();
      },
      undefined,
      (error) => console.error('Erreur chargement mall.glb :', error)
    );
  }

  private startRender(): void {
    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        this.animFrameId = requestAnimationFrame(loop);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };
      loop();
    });
  }

  private listenResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(canvas.parentElement!);
  }

  private onResize(): void {
    const { w, h } = this.getSize();
    if (w === 0 || h === 0) return;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  private listenCtrl(): void {
    this.ctrlListener = (e: KeyboardEvent) => {
      if (e.type === 'keydown' && e.key === 'Control') {
        this.controls.enablePan = false;
      } else if (e.type === 'keyup' && e.key === 'Control') {
        this.controls.enablePan = true;
      }
    };
    document.addEventListener('keydown', this.ctrlListener);
    document.addEventListener('keyup', this.ctrlListener);
  }

  private listenMouse(): void {
    const canvas = this.canvasRef.nativeElement;

    // Enregistrer la position du mousedown pour distinguer clic vs drag
    this.mouseDownListener = (e: MouseEvent) => {
      this.mouseDownPos = { x: e.clientX, y: e.clientY };
    };

    this.mouseMoveListener = (e: MouseEvent) => {
      this.ngZone.runOutsideAngular(() => {
        const rect = canvas.getBoundingClientRect();
        this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.shopMeshes, false);
        const hit = intersects.length > 0 ? (intersects[0].object as THREE.Mesh) : null;

        if (hit !== this.hoveredMesh) {
          // Réinitialiser le hover précédent (sauf si c'est le mesh sélectionné)
          if (this.hoveredMesh && this.hoveredMesh !== this.selectedMesh) {
            this.restoreMaterial(this.hoveredMesh);
          }
          this.hoveredMesh = hit;
          if (hit && hit !== this.selectedMesh) {
            this.applyHighlight(hit, 0x64b5f6); // bleu clair hover
          }
        }

        this.ngZone.run(() => {
          if (hit) {
            this.hoveredShopName = this.getShopName(hit);
            this.tooltipX = e.clientX;
            this.tooltipY = e.clientY;
            canvas.style.cursor = 'pointer';
          } else {
            this.hoveredShopName = null;
            canvas.style.cursor = 'grab';
          }
        });
      });
    };

    this.clickListener = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - this.mouseDownPos.x);
      const dy = Math.abs(e.clientY - this.mouseDownPos.y);
      if (dx > 5 || dy > 5) return;

      const rect = canvas.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(this.shopMeshes, false);

      this.ngZone.run(() => {
        if (intersects.length > 0) {
          const mesh = intersects[0].object as THREE.Mesh;

          // Désélectionner l'ancien mesh sélectionné
          if (this.selectedMesh && this.selectedMesh !== mesh) {
            this.restoreMaterial(this.selectedMesh);
          }

          this.selectedMesh = mesh;
          this.applyHighlight(mesh, 0xff7043); // orange pour la sélection

          const event: ShopClickEvent = {
            name: this.getShopName(mesh),
            mesh,
            screenX: e.clientX,
            screenY: e.clientY,
          };
          this.selectedShop = event;
          this.shopClicked.emit(event);
        } else {
          // Clic dans le vide → désélectionner
          if (this.selectedMesh) {
            this.restoreMaterial(this.selectedMesh);
            this.selectedMesh = null;
          }
          this.selectedShop = null;
        }
      });
    };

    canvas.addEventListener('mousedown', this.mouseDownListener);
    canvas.addEventListener('mousemove', this.mouseMoveListener);
    canvas.addEventListener('click', this.clickListener);
  }

  private getShopName(mesh: THREE.Mesh): string {
    const raw = mesh.name || mesh.parent?.name || 'Boutique inconnue';
    return raw.replace(/_\d+$/, '').replace(/_/g, ' ').trim() || 'Boutique inconnue';
  }

  private applyHighlight(mesh: THREE.Mesh, color: number): void {
    const highlight = (mat: THREE.Material): THREE.Material => {
      const m = (mat as THREE.MeshStandardMaterial).clone();
      (m as THREE.MeshStandardMaterial).emissive = new THREE.Color(color);
      (m as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
      return m;
    };
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(highlight);
    } else {
      mesh.material = highlight(mesh.material);
    }
  }

  private restoreMaterial(mesh: THREE.Mesh): void {
    const original = this.originalMaterials.get(mesh);
    if (original) {
      mesh.material = Array.isArray(original)
        ? original.map((m) => m.clone())
        : (original as THREE.Material).clone();
    }
  }

  deselectShop(): void {
    if (this.selectedMesh) {
      this.restoreMaterial(this.selectedMesh);
      this.selectedMesh = null;
    }
    this.selectedShop = null;
  }
}
