import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-shop-visualization',
  standalone: false,
  templateUrl: './shop-visualization.component.html',
  styleUrl: './shop-visualization.component.scss',
})
export class ShopVisualizationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animFrameId!: number;
  private resizeObserver!: ResizeObserver;
  private ctrlListener!: (e: KeyboardEvent) => void;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initThree();
    this.loadModel();
    this.startRender();
    this.listenResize();
    this.listenCtrl();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
    this.resizeObserver?.disconnect();
    this.controls?.dispose();
    this.renderer?.dispose();
    document.removeEventListener('keydown', this.ctrlListener);
    document.removeEventListener('keyup', this.ctrlListener);
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
        model.position.y = 20

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
}
