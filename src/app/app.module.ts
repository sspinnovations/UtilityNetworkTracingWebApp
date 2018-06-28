import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AuthguardGuard } from './authguard.guard';
import { AuthService } from './services/auth.service';
import { UtilityNetworkService } from './services/utilitynetwork.service';
import { EsriMapComponent } from './components/esri-map/esri-map.component';
import { ItemsComponent } from './components/items/items.component';
import { DomainnetworksComponent } from './components/domainnetworks/domainnetworks.component';
import { TiersComponent } from './components/tiers/tiers.component';
import { SubnetworksComponent } from './components/subnetworks/subnetworks.component';
import { TraceSubnetworkComponent } from './components/trace/subnetwork/trace-subnetwork.component';
import { LoadingComponent } from './components/loading/loading.component';
import { TraceService } from './services/trace.service';
import { TraceOptionsComponent } from './components/trace/options/trace-options.component';
import { TraceResultsComponent } from './components/trace/results/trace-results.component';
import { TraceComponent } from './components/trace/trace.component';
import { FeatureService } from './services/feature.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticateComponent,
    HomeComponent,
    EsriMapComponent,
    ItemsComponent,
    DomainnetworksComponent,
    TiersComponent,
    SubnetworksComponent,
    TraceSubnetworkComponent,
    LoadingComponent,
    TraceOptionsComponent,
    TraceResultsComponent,
    TraceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [AuthguardGuard, AuthService, UtilityNetworkService, TraceService, FeatureService],
  bootstrap: [AppComponent]
})
export class AppModule { }
