
import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRConfig } from '../types';

interface QRCodeDisplayProps {
  config: QRConfig;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling>(new QRCodeStyling({
    width: 220,
    height: 220,
    type: 'svg',
    data: config.value || ' ',
    dotsOptions: {
      color: config.fgColor,
      type: 'square'
    },
    backgroundOptions: {
      color: config.bgColor,
    },
    qrOptions: {
      errorCorrectionLevel: config.level
    }
  }));

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      qrCode.current.append(containerRef.current);
    }
  }, []);

  useEffect(() => {
    qrCode.current.update({
      data: config.value || ' ',
      dotsOptions: {
        color: config.fgColor,
        type: config.dotType as any
      },
      cornersSquareOptions: {
        type: config.cornerType as any,
        color: config.fgColor
      },
      cornersDotOptions: {
        type: config.cornerType === 'dot' ? 'dot' : 'square' as any,
        color: config.fgColor
      },
      backgroundOptions: {
        color: config.bgColor,
      },
      qrOptions: {
        errorCorrectionLevel: config.level
      }
    });
  }, [config]);

  const downloadQR = (format: 'png' | 'svg') => {
    if (!config.value || config.value.trim() === '') return;
    qrCode.current.download({ name: `qrlabs-export-${Date.now()}`, extension: format });
  };

  const printQR = () => {
    if (!config.value || config.value.trim() === '') return;
    window.print();
  };

  // Classe comune per i pulsanti luminosi
  const buttonBaseClass = "flex-1 py-3 px-3 bg-blue-500 text-white rounded-lg font-black shadow-lg shadow-blue-500/40 hover:bg-blue-400 hover:-translate-y-0.5 transition-all active:scale-95 text-[9px] uppercase tracking-[0.15em] border border-blue-300/30 flex items-center justify-center space-x-2";

  return (
    <div className="flex flex-col items-center space-y-5 w-full">
      <div 
        id="qr-print-area"
        ref={containerRef}
        className="p-3 bg-white rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 flex items-center justify-center overflow-hidden transition-all duration-500 ease-out hover:scale-[1.04] hover:rotate-[1deg] cursor-pointer"
      >
        {/* QR Output */}
      </div>

      <div className="flex flex-col space-y-2 w-full max-w-[260px]">
        <div className="flex space-x-2">
          <button
            onClick={() => downloadQR('png')}
            className={buttonBaseClass}
          >
            PNG Export
          </button>
          <button
            onClick={() => downloadQR('svg')}
            className={buttonBaseClass}
          >
            SVG Pro
          </button>
        </div>
        <button
          onClick={printQR}
          className={`${buttonBaseClass} w-full`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>PDF / STAMPA</span>
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
