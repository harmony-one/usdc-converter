import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DevicePhoneMobileIcon, ComputerDesktopIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function PreviewModal({ isOpen, closeModal, previewData, viewportSize, setViewportSize }) {
  const getPreviewWidth = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-[1024px]';
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-gray-800 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-medium">
                    Transaction Preview
                  </Dialog.Title>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2 bg-gray-700 p-1 rounded-lg">
                      <button
                        onClick={() => setViewportSize('mobile')}
                        className={`p-1 rounded ${
                          viewportSize === 'mobile' ? 'bg-gray-600' : ''
                        }`}
                        title="Mobile view"
                      >
                        <DevicePhoneMobileIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewportSize('desktop')}
                        className={`p-1 rounded ${
                          viewportSize === 'desktop' ? 'bg-gray-600' : ''
                        }`}
                        title="Desktop view"
                      >
                        <ComputerDesktopIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      onClick={closeModal}
                      className="rounded-lg p-1 hover:bg-gray-700"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className={`mx-auto ${getPreviewWidth()} transition-all duration-300`}>
                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">From</span>
                        <span>{previewData.fromAmount} {previewData.fromToken}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">To</span>
                        <span>{previewData.toAmount} {previewData.toToken}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rate</span>
                        <span>1:1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gas Fee (estimated)</span>
                        <span>{previewData.gasFee} ONE</span>
                      </div>
                      <div className="border-t border-gray-600 pt-4">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <div className="text-right">
                            <div>{previewData.fromAmount} {previewData.fromToken}</div>
                            <div className="text-sm text-gray-400">+ {previewData.gasFee} ONE (gas)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
