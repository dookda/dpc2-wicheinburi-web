import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../services/data.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public map: any;
  public center: any;
  public zoom: any;

  public grod: any;
  public gter: any;
  public ghyb: any;
  public mbox: any;

  public tam: any;
  public amp: any;
  public pro: any;
  public parcel: any;
  public mobileAdd: any;

  public flood: any;

  public proCheck: any;
  public ampCheck: any;
  public tamCheck: any;
  public commuCheck: any;
  public parcelCheck: any;

  public circle: any;
  public radius: number;
  public parcelAll: any;

  public p: any;

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.center = [15.660878, 101.081535];
    this.zoom = 13;
    this.loadmap();
    // this.loadCommu();
  }

  loadmap() {
    this.map = L.map('map', {
      center: this.center,
      zoom: this.zoom
    });

    // base map
    this.mbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy;',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiY3NrZWxseSIsImEiOiJjamV1NTd1eXIwMTh2MzN1bDBhN3AyamxoIn0.Z2euk6_og32zgG6nQrbFLw'
    });

    this.grod = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    this.ghyb = L.tileLayer('http://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    this.gter = L.tileLayer('http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    // overlay map
    const mapUrl = 'http://map.nu.ac.th/geoserver-hgis/ows?';
    const cgiUrl = 'http://www.cgi.uru.ac.th/geoserver/ows?';
    const flood = 'http://www.cgi.uru.ac.th/gs-flood/ows?';


    this.mobileAdd = L.tileLayer.wms(cgiUrl, {
      layers: 'upn:mobile_report',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      tiled: false,
      // CQL_FILTER: 'prov_code=53'
    });

    this.parcel = L.tileLayer.wms(cgiUrl, {
      layers: 'upn:parcel_3857',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      tiled: false,
      // CQL_FILTER: 'prov_code=53'
    });

    this.pro = L.tileLayer.wms(mapUrl, {
      layers: 'hgis:dpc9_province_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'prov_code=67'
    });

    this.amp = L.tileLayer.wms(mapUrl, {
      layers: 'hgis:dpc9_amphoe_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'amp_code=6705'
    });

    this.tam = L.tileLayer.wms(mapUrl, {
      layers: 'hgis:dpc9_tambon_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'amp_code=6705'
    });

    const baseLayers = {
      'map box': this.mbox,
      'แผนที่ถนน': this.grod,
      'แผนที่ภาพดาวเทียม': this.ghyb,
      'แผนที่ภูมิประเทศ': this.gter.addTo(this.map),
    };

    const overlayLayers = {
      'ข้อมูลจากภาคสนาม': this.mobileAdd.addTo(this.map),
      'ขอบเขตพื้นที่ชุมชน': this.parcel.addTo(this.map),
      'ขอบเขตจังหวัด': this.pro.addTo(this.map),
      'ขอบเขตอำเภอ': this.amp.addTo(this.map),
      'ขอบเขตตำบล': this.tam.addTo(this.map),
    };

    // L.control.layers(baseLayers, overlayLayers).addTo(this.map);
    this.proCheck = true;
    this.ampCheck = true;
    this.tamCheck = true;
    this.commuCheck = false;
    this.parcelCheck = true;

    this.map.on('click', (e) => {
      const latlng = e.latlng;
      if (this.parcelCheck) {
        // popupInfo
        this.getFeatureInfo(latlng.lng, latlng.lat);
      }
    });
    this.loadParcel();
  }

  async getFeatureInfo(lng: number, lat: number) {
    await this.dataService.getParcelInfo(lng, lat).then((res: any) => {
      // console.log(res.feature[0]);
      if (res.totalFeatures > 0) {
        L.popup({
          maxWidth: 400, // offset: [5, -25]
        }).setLatLng([lat, lng])
          .setContent(
            '<br> <span id="kanit13">รหัสผู้ใช้</span>: ' + res.features[0].properties.id_user +
            '<br> <span id="kanit13">lat</span>: ' + res.features[0].properties.lat +
            '<span id="kanit13"> lon</span>:' + res.features[0].properties.lon +
            '<br> <span id="kanit13">สถานที่</span>: ' + res.features[0].properties.pname +
            '<br> <span id="kanit13">คำอธิบาย</span>: ' + res.features[0].properties.pdesc +
            // '<br> <span id="kanit13">รูปภาพ</span>: <br><img height="240px" src="' + res.feature[0].properties.photo + ' ">' +
            '<br> <span id="kanit13">วันที่รายงาน</span>: ' + res.features[0].properties.pdate
          ).openOn(this.map);
      }
    });
  }

  loadParcel() {
    this.dataService.getParcel().then((res: any) => {
      // console.log(res);
      this.parcelAll = res.features;
    });
  }

  onClickList(p) {
    const arr = [];
    console.log(p);
    for (const i of p) {
      if (i) {
        const a = i.reverse();
        arr.push(a);
      }
    }
    this.map.fitBounds(arr);
    //   L.popup({
    //     maxWidth: 200, // offset: [5, -25]
    //   }).setLatLng([latlng.lat, latlng.lng]).setContent('<span id="kanit13">build</span>: ' +
    //     res.features[0].properties.hs_no +
    //     '<br> <span id="kanit13">hs-no</span>: ' +
    //     res.features[0].properties.building_c).openOn(this.map);
    // }
  }

  onCheckJson(lyr: string, isChecked: boolean) {
    if (isChecked) {
      if (lyr === 'pro') {
        this.map.addLayer(this.pro);
        this.proCheck = true;
      } else if (lyr === 'amp') {
        this.map.addLayer(this.amp);
        this.ampCheck = true;
      } else if (lyr === 'tam') {
        this.map.addLayer(this.tam);
        this.tamCheck = true;
      } else if (lyr === 'flood') {
        this.map.addLayer(this.parcel);
        this.parcelCheck = true;
      }
    } else {
      if (lyr === 'pro') {
        this.map.removeLayer(this.pro);
        this.proCheck = false;
      } else if (lyr === 'amp') {
        this.map.removeLayer(this.amp);
        this.ampCheck = false;
      } else if (lyr === 'tam') {
        this.map.removeLayer(this.tam);
        this.tamCheck = false;
      } else if (lyr === 'flood') {
        this.map.removeLayer(this.parcel);
        this.parcelCheck = false;
      }
    }
  }

  onSelect(lyr) {
    const lyrBase = [
      { id: 'grod', lyr: this.grod },
      { id: 'ghyb', lyr: this.ghyb },
      { id: 'gter', lyr: this.gter },
      { id: 'mbox', lyr: this.mbox }
    ];

    for (const i in lyrBase) {
      if (lyrBase[i].id === lyr) {
        // console.log('yes', lyrBase[i].lyr);
        this.map.addLayer(lyrBase[i].lyr);
      } else {
        // console.log('no', lyrBase[i].lyr);
        this.map.removeLayer(lyrBase[i].lyr);
      }
    }
  }

}
