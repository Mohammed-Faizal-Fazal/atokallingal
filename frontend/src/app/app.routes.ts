import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Kallingal Group - Bajaj, Chetak EV & Tata Service in Trivandrum',
    data: { description: 'Bajaj two & three wheelers, Chetak EV, Tata authorized service and insurance across Trivandrum.' } },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
    title: 'Bajaj Two & Three Wheelers, Chetak EV | Kallingal Group Trivandrum',
    data: { description: 'Explore the full Bajaj range, commercial three wheelers and the all-electric Chetak EV. Book a test drive in Trivandrum.' } },
  { path: 'services', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent),
    title: 'Tata Authorized Service & Insurance | Kallingal Group',
    data: { description: 'Tata Authorized Service Center, genuine parts and in-house insurance services in Trivandrum.' } },
  { path: 'gallery', loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent),
    title: 'Gallery | Kallingal Group',
    data: { description: 'Showrooms, milestones and the people behind the Kallingal name.' } },
  { path: 'showrooms', loadComponent: () => import('./pages/showrooms/showrooms.component').then(m => m.ShowroomsComponent),
    title: 'Showrooms Across Trivandrum | Kallingal Group',
    data: { description: 'Find your nearest Kallingal showroom with locations, phone numbers and directions from the live showroom directory.' } },
  { path: 'careers', loadComponent: () => import('./pages/careers/careers.component').then(m => m.CareersComponent),
    title: 'Careers at Kallingal Group | Jobs in Trivandrum',
    data: { description: 'Open roles in sales, service and operations across the Kallingal network.' } },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact Kallingal Group | Sales, Service & Insurance',
    data: { description: 'Reach our sales, service or insurance teams - call, WhatsApp or send an enquiry.' } },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    title: 'Admin | Kallingal Group' },
  { path: '**', redirectTo: '' }
];
