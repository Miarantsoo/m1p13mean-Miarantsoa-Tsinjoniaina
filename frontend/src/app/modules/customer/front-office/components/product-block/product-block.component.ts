import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-block',
  standalone: false,
  templateUrl: './product-block.component.html',
  styleUrl: './product-block.component.scss'
})
export class ProductBlockComponent {
  @Input() category = '';
  @Input() imageUrl = '';
  @Input() imageAlt = '';
  @Input() code = '';
  @Input() type = '';
}
