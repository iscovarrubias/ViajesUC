import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarQRPage } from './generar-qr.page';

describe('GenerarQRPage', () => {
  let component: GenerarQRPage;
  let fixture: ComponentFixture<GenerarQRPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerarQRPage]
    }).compileComponents();

    fixture = TestBed.createComponent(GenerarQRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
