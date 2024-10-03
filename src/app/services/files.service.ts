import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {first, firstValueFrom, map, Observable} from "rxjs";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {resolve} from "@angular/compiler-cli";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  apiUploadUrl: string = "http://localhost:8080/api/files/upload";
  apiUploadMultiUrl: string = "http://localhost:8080/api/files/upload_multi";
  apiDownloadUrl: string = "http://localhost:8080/api/files/download";
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }


  upload(file: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.apiUploadUrl, formData);
  }
  uploadMulti(files: any[]): Observable<any> {
    const formData: FormData = new FormData();
    for (const file of files)
      formData.append('files', file, file.name);
    return this.http.post(this.apiUploadMultiUrl, formData);
  }

  download(fileId: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiDownloadUrl}/${fileId}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  async uploadProductImages(files: any[]): Promise<any> {
    try {
      const response = await firstValueFrom(this.uploadMulti(files));
      return response;
    } catch (error) {
      throw error;
    }
  }

  isImageFile(file: File): boolean {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validImageTypes.includes(file.type);
  }

  addImage(event: any, images_urls: any[], selectedFiles: any[]): any {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.isImageFile(file)) {
      selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        images_urls.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    return false;
  }
  generateImageUrl(imageId: any): Observable<any> {
    return this.download(imageId).pipe(
      first(),
      map(response => {
        const blob = new Blob([response.body!], { type: response.body!.type });
        const file = new File([blob], imageId, { type: blob.type });

        const objectUrl = URL.createObjectURL(blob);
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 5000);

        return {
          "url": objectUrl,
          "file": file
        };
      })
    );
  }
}
