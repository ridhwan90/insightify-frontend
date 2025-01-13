import React, { useEffect, useState } from 'react';
import { analyzeArchitectPlan } from '../service/architectApi';
import { createFileRoute } from '@tanstack/react-router';
import * as pdfjsLib from 'pdfjs-dist';
import CheckboxImage from '../components/CheckboxImage';
import ReactMarkdown from 'react-markdown';

import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const PDFUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [checkboxState, setCheckboxState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (analysisResult?.result_json) {
      const state = analysisResult.result_json.reduce((acc: Record<string, boolean>, item: any) => {
        acc[item.key] = item.present;
        return acc;
      }, {});
      setCheckboxState(state);
    }
  }, [analysisResult]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Please upload a valid PDF file.');
      }
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    if (!file) {
      setError('No file selected.');
      return;
    }

    setLoading(true);
    try {
      const convertedImages = await convertPDFToImages(file);
      setImages(convertedImages);
      try {
        const analysisResult = await analyzeArchitectPlan(file);
        console.log('Analysis result:', analysisResult);
        setAnalysisResult(analysisResult);
      } catch (error) {
        console.error('Error analyzing architect plan:', error);
        setError('Failed to analyze architect plan.');
      }
    }  catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Failed to convert PDF to images.');
    } finally {
      setLoading(false);
    }
  };

  const convertPDFToImages = async (file: File): Promise<string[]> => {
    const fileReader = new FileReader();
    const images: string[] = [];

    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        console.log('fileReader.onload called');
        if (!fileReader.result) {
          console.error('fileReader.result is null');
          reject(new Error('Failed to read file'));
          return;
        }
        try {
          const pdfData = new Uint8Array(fileReader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          console.log('pdf loaded', pdf);
          const totalPages = pdf.numPages;

          for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
              throw new Error('Could not get canvas context');
            }

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext).promise;
            const image = canvas.toDataURL('image/png');
            images.push(image);
          }

          resolve(images);
        } catch (err) {
          console.error('Error in convertPDFToImages:', err);
          reject(err);
        }
      };

      fileReader.onerror = (error) => reject(error);
      fileReader.onerror = (error) => {
        console.error('fileReader.onerror called', error);
        reject(error);
      };
      fileReader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="pdf-uploader max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Upload Floor Plan File</h1>
      <div className="file-input flex flex-col items-center mb-4">
        <label htmlFor="pdf-upload" className="mb-2 font-medium">Choose a PDF file:</label>
        <input
          type="file"
          id="pdf-upload"
          accept=".pdf"
          onChange={handleFileChange}
          className="border rounded p-2"
        />
      </div>
      {error && <p className="error text-red-500 mt-2">{error}</p>}
      {file && <p className="mt-2 text-gray-600">Selected file: {file?.name}</p>}
      <button onClick={handleSubmit} disabled={loading} className="bg-primary text-white rounded px-4 py-2 mt-4 hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed">
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {loading && <p className="mt-2 text-gray-600">Converting PDF to images and analyze with AI...</p>}
      <div className="mt-4 flex flex-wrap justify-center">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Page ${index + 1}`}
            className="w-48 m-2 rounded shadow-md cursor-pointer"
            onClick={() => {
              setSelectedImage(image);
              setModalOpen(true);
            }}
          />
        ))}
      </div>
      {analysisResult && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
          <ul className="list-none pl-0">
            <li className="mb-2 flex items-center justify-between">
              Pelan kunci (menunjukkan seksyen-seksyen di Shah Alam)
              <CheckboxImage checked={checkboxState.keyPlan || false} />
            </li>
            <li className="mb-2 flex items-center justify-between">
              Pelan lokasi yang jelas menunjukkan arah dari jalan utama ke tapak skala bersesuaian
              <CheckboxImage checked={checkboxState.locationPlan || false} />
            </li>
            <li className="mb-2 flex items-center justify-between">
              Pelan Tapak dalam skala 1 : 200
              <CheckboxImage checked={checkboxState.sitePlan || false} />
            </li>
            <li className="mb-2 flex items-center justify-between">
              Pelan Lantai dalam skala 1 : 100
              <CheckboxImage checked={checkboxState.groundPlan || false} />
            </li>
            <li className="mb-2 flex items-center justify-between">
              Jadual spesifikasi saiz dan jenis tingkap/ pintu dan bukaan lain.
              <CheckboxImage checked={checkboxState.windowDoorSpecificationTable || false} />
            </li>
            <li className="mb-2 flex items-center justify-between">
              Jadual peratusan pengudaraan dan pencahayaan (10% dari keluasan keluasan lantai sesuatu ruang)
              <CheckboxImage checked={checkboxState.ventilationLightingTable || false} />
            </li>
          </ul>
          {analysisResult.result && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Analysis Details</h3>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-md">
                <ReactMarkdown>
                  {analysisResult.result}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
      {modalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
          onWheel={(e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoomLevel((prev) => Math.max(0.5, Math.min(2, prev + delta)));
          }}
        >
          <div className="bg-white rounded-lg p-4 max-w-4xl max-h-full overflow-auto">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Enlarged Page"
                className="max-w-full max-h-full"
                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.1s ease' }}
              />
            )}
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/architect')({
  component: PDFUploader,
});
