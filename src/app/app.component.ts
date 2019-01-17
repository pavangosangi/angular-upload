import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

const url = 'http://localhost:3000/file/upload';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'upload';
  files = [];

  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    console.log(event);
    for (const i of event.target.files) {
      const userFile = new UserFile(i);
      this.files.push(userFile);
    }
    console.log(this.files);
  }

  onUpload(file) {
    for (const i in this.files) {
      if (file === this.files[i]) {
        const fd = new FormData();
        fd.append('file', file.file, file.file.name);
        this.http.post('http://localhost:3000/file/upload', fd, {reportProgress: true, observe: 'events'}).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            file.setUploadProgress(Math.round(event.loaded / event.total * 100));
          } else if (event.type === HttpEventType.Response) {
            console.log(event);
          }
        });
      }
    }
  }

  onCancel(file) {
    const i: number = this.files.indexOf(file);
    this.files.splice(i);
  }
}

export class UserFile {
  uploadProgress;
  file;
  constructor(file) {
    this.file = file;
    this.uploadProgress = 0;
  }

  setUploadProgress(progress) {
    this.uploadProgress = progress;
  }
}
