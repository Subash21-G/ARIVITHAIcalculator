import { Routes } from '@angular/router';
import { BasicComponent } from './features/basic/basic';
import { GstComponent } from './features/gst/gst';
import { DiscountComponent } from './features/discount/discount';
import { PlaceholderComponent } from './shared/placeholder';
export const routes: Routes = [
  {path:'',component:BasicComponent,title:'Basic calculator | ARIVITHAI'},
  {path:'gst',component:GstComponent,title:'GST calculator | ARIVITHAI'},
  {path:'discount',component:DiscountComponent,title:'Discount calculator | ARIVITHAI'},
  {path:'history',component:PlaceholderComponent,data:{title:'History',description:'Local calculation history arrives in Phase 4.'}},
  {path:'settings',component:PlaceholderComponent,data:{title:'Settings',description:'Language and theme settings arrive in Phase 4.'}},
  {path:'help',component:PlaceholderComponent,data:{title:'Help',description:'Examples and keyboard shortcuts are being prepared.'}},
  {path:'**',redirectTo:''}
];
