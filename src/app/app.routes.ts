import { Routes } from '@angular/router';
import { BasicComponent } from './features/basic/basic';
import { GstComponent } from './features/gst/gst';
import { DiscountComponent } from './features/discount/discount';
import { HistoryComponent } from './features/history/history';
import { SettingsComponent } from './features/settings/settings';
import { HelpComponent } from './features/help/help';
import { AboutComponent } from './features/about/about';
import { PrivacyComponent } from './features/privacy/privacy';
export const routes: Routes = [
  {path:'',component:BasicComponent,title:'Basic calculator | ARIVITHAI'},
  {path:'gst',component:GstComponent,title:'GST calculator | ARIVITHAI'},
  {path:'discount',component:DiscountComponent,title:'Discount calculator | ARIVITHAI'},
  {path:'history',component:HistoryComponent,title:'History | ARIVITHAI'},
  {path:'settings',component:SettingsComponent,title:'Settings | ARIVITHAI'},
  {path:'help',component:HelpComponent,title:'Help | ARIVITHAI'},
  {path:'about',component:AboutComponent,title:'About | ARIVITHAI'},
  {path:'privacy-policy',component:PrivacyComponent,title:'Privacy Policy | ARIVITHAI'},
  {path:'**',redirectTo:''}
];
