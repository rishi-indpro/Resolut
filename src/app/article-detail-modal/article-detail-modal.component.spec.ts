import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailModalComponent } from './article-detail-modal.component';

describe('ArticleDetailModalComponent', () => {
  let component: ArticleDetailModalComponent;
  let fixture: ComponentFixture<ArticleDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
