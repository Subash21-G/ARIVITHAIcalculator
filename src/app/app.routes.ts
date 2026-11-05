import { Routes } from '@angular/router';
import { BasicComponent } from './features/basic/basic';
import { PlaceholderComponent } from './shared/placeholder';
export const routes: Routes = [
  {path:'',component:BasicComponent,title:'Basic calculator | ARIVITHAI'},
  {path:'gst',component:PlaceholderComponent,data:{title:'GST calculator',description:'Inclusive and exclusive GST calculations arrive in Phase 3.'}},
  {path:'discount',component:PlaceholderComponent,data:{title:'Discount calculator',description:'Percentage and fixed discounts arrive in Phase 3.'}},
  {path:'history',component:PlaceholderComponent,data:{title:'History',description:'Local calculation history arrives in Phase 4.'}},
  {path:'settings',component:PlaceholderComponent,data:{title:'Settings',description:'Language and theme settings arrive in Phase 4.'}},
  {path:'help',component:PlaceholderComponent,data:{title:'Help',description:'Examples and keyboard shortcuts are being prepared.'}},
  {path:'**',redirectTo:''}
];
