import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../services/data.service';

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
        this.dataService.getParcelInfo(latlng.lng, latlng.lat).then((res: any) => {
          if (res.totalFeatures > 0) {
            L.popup({
              maxWidth: 400, // offset: [5, -25]
            }).setLatLng([latlng.lat, latlng.lng])
              .setContent(
                //   '<span id="kanit13">build</span>: ' + res.features[0].properties.hs_no +
                // '<br> <span id="kanit13">hs-no</span>: ' + res.features[0].properties.building_c

                '<br> <span id="kanit13">เลขที่โฉนด</span>: ' + res.features[0].properties.id +
                '<br> <span id="kanit13">ชื่อ-สกุล</span>: ' + res.features[0].properties.f_name +
                '<br> <span id="kanit13">ที่อยู่</span>: ' + res.features[0].properties.vill_no +
                ' หมู่ ' + res.features[0].properties.moo +
                ' ต. ' + res.features[0].properties.tambon +
                ' อ. ' + res.features[0].properties.amphoe +
                ' จ. ' + res.features[0].properties.province +
                '<br> <span id="kanit13">เบอร์โทร</span>: ' + res.features[0].properties.tel +
                '<br> <span id="kanit13">จำนวนต้นมะม่วงหิมพานต์ </span>: ' + res.features[0].properties.total +
                '<br> <span id="kanit13">จำนวนต้นที่ให้ผลผลิตแล้ว</span>: ' + res.features[0].properties.produce +
                '<br> <span id="kanit13">จำนวนต้นที่ยังไม่ให้ผลผลิต</span>: ' + res.features[0].properties.noproduce +
                '<br> <span id="kanit13">ปริมาณผลผลิต (กก./ปี)</span>: ' + res.features[0].properties.result +
                '<br> <span id="kanit13">กรรมสิทธิ์การถือครองที่ดิน </span>: ' + res.features[0].properties.f_right +
                '<br> <span id="kanit13">ต้นทุนการผลิต (บาท/ปี)</span>: ' + res.features[0].properties.f_cost +
                '<br> <span id="kanit13">ค่าปุ๋ย/ยา  (บาท/ปี)</span>: ' + res.features[0].properties.drug +
                '<br> <span id="kanit13">ค่าแรงงาน (บาท/ปี)</span>: ' + res.features[0].properties.labor +
                '<br> <span id="kanit13">ค่าขนส่ง (บาท/ปี)</span>: ' + res.features[0].properties.trans +
                '<br> <span id="kanit13">เนื้อที่</span>: ' + res.features[0].properties.rai + ' ไร่ ' +
                res.features[0].properties.ngan + ' งาน ' + res.features[0].properties.wa + ' วา ' +
                '<br> <span id="kanit13">รายจ่ายในการปลูก </span>: ' + res.features[0].properties.expend +
                '<br> <span id="kanit13">รายได้ในการปลูก</span>: ' + res.features[0].properties.income +
                '<br> <span id="kanit13">แหล่งเงินทุนในการปลูก</span>: ' + res.features[0].properties.fund +
                '<br> <span id="kanit13">แหล่งน้ำที่ใช้ในการปลูก</span>: ' + res.features[0].properties.water +
                '<br> <span id="kanit13">ชนิดของปุ๋ยที่ใส่</span>: ' + res.features[0].properties.fertil +
                '<br> <span id="kanit13">โรคที่พบ</span>: ' + res.features[0].properties.disease

              ).openOn(this.map);
          }
        });
      }
    });
    this.loadParcel();
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
