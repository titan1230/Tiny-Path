"use client";

import { backgroundOptions } from "@/lib/constants/bg";
import { BackgroundOption } from "@/types";

interface BackgroundPickerModalProps {
  isOpen: boolean;
  currentBackground: string;
  onBackgroundChange: (background: string) => void;
  onClose: () => void;
}

const BackgroundPickerModal: React.FC<BackgroundPickerModalProps> = ({
  isOpen,
  currentBackground,
  onBackgroundChange,
  onClose,
}) => {
  const handleBackgroundSelect = (backgroundClass: string) => {
    onBackgroundChange(backgroundClass);
    // Don't close modal - let user continue selecting
  };

  return (
    <>
      <input
        type="checkbox"
        id="background-modal"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white/10 backdrop-blur-sm border border-white/20">
          <h3 className="font-bold text-lg text-white mb-4">
            Choose Background
          </h3>

          {/* Gradients */}
          <div className="mb-6">
            <h4 className="text-white/80 text-sm font-medium mb-3">
              Gradients
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {backgroundOptions.gradients.map(
                (bg: BackgroundOption, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleBackgroundSelect(bg.class)}
                    className={`w-full h-12 rounded-lg ${bg.class} border-2 transition-all duration-200 hover:scale-105 ${
                      currentBackground === bg.class
                        ? "border-white shadow-lg ring-2 ring-white/50"
                        : "border-white/30"
                    }`}
                    title={bg.name}
                  />
                )
              )}
            </div>
          </div>

          {/* Solid Colors */}
          <div className="mb-6">
            <h4 className="text-white/80 text-sm font-medium mb-3">
              Solid Colors
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {backgroundOptions.solids.map(
                (bg: BackgroundOption, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleBackgroundSelect(bg.class)}
                    className={`w-full h-10 rounded-lg ${bg.class} border-2 transition-all duration-200 hover:scale-105 ${
                      currentBackground === bg.class
                        ? "border-white shadow-lg ring-2 ring-white/50"
                        : "border-white/30"
                    }`}
                    title={bg.name}
                  />
                )
              )}
            </div>
          </div>

          <div className="modal-action">
            <button
              onClick={onClose}
              className="btn bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Close
            </button>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="background-modal" onClick={onClose}>
          Close
        </label>
      </div>
    </>
  );
};

export default BackgroundPickerModal;
