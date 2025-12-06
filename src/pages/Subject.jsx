import React, { useEffect, useState } from "react";
import PdfViewer from "../components/PdfViewer";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, Video, Download, Star, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { getUnit } from "@/data/syllabus/jntuk/r23/cse-ai-ml/units/unitsIndex.js";
import { getPreviousPapers } from "@/data/syllabus/jntuk/r23/cse-ai-ml/subjects/previous-papers.js";
import { getImportantQuestions } from "@/data/syllabus/jntuk/r23/cse-ai-ml/subjects/important-questions.js";

// ------------------------------------
// Load REAL subject file from subjects/<subjectId>.js
// ------------------------------------
const loadSubjectFile = async (subjectId) => {
  try {
    const module = await import(
      `@/data/syllabus/jntuk/r23/cse-ai-ml/subjects/${subjectId}.js`
    );
    return module.default;
  } catch (err) {
    console.error("❌ Subject file load failed:", err);
    return null;
  }
};

const Subject = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [unitsData, setUnitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state for viewing PDFs
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "papers" or "questions"
  const [modalUnitId, setModalUnitId] = useState(null);
  const [modalContent, setModalContent] = useState([]); // Array of URLs
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  // ------------------------------------
  // SCROLL TO TOP ON PAGE LOAD
  // ------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [subjectId]);

  // ------------------------------------
  // MAIN LOADING LOGIC
  // ------------------------------------
  useEffect(() => {
    const loadAll = async () => {
      // Load subject info (from subjects/<id>.js)
      const subjectFile = await loadSubjectFile(subjectId);
      if (!subjectFile) {
        setLoading(false);
        return;
      }

      setSubject(subjectFile);

      // Load all unit data from the pre-imported units map
      // Prefer the title from the subject `units` array (unitInfo) so
      // the displayed unit name matches the syllabus listing.
      const loadedUnits = subjectFile.units.map((unitInfo) => {
        const unitData = getUnit(subjectId, unitInfo.unit);
        // Merge: keep unitData (topics, pdf, etc.) but let unitInfo override
        // fields like `title` so the subject-provided name shows.
        return unitData ? { ...unitData, ...unitInfo } : unitInfo;
      });

      setUnitsData(loadedUnits);
      setLoading(false);
    };

    loadAll();
  }, [subjectId]);

  // ------------------------------------
  // HELPER: Parse Google Drive URL
  // ------------------------------------
  const parseDriveUrl = (url) => {
    try {
      const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (m && m[1]) {
        const id = m[1];
        return {
          embed: `https://drive.google.com/file/d/${id}/preview`,
          download: `https://drive.google.com/uc?export=download&id=${id}`,
          view: `https://drive.google.com/file/d/${id}/view?usp=sharing`,
        };
      }
    } catch (e) {}
    return null;
  };

  // ------------------------------------
  // OPEN MODAL: Show papers or questions
  // ------------------------------------
  const openModal = (type, unitId) => {
    setModalType(type);
    setModalUnitId(unitId);
    setCurrentPdfIndex(0);
    
    if (type === "papers") {
      const papers = getPreviousPapers(subjectId) || [];
      setModalContent(papers);
      if (papers.length > 0) {
        loadPdfPreview(papers[0]);
      }
    } else if (type === "questions") {
      const questions = getImportantQuestions(subjectId) || [];
      setModalContent(questions);
      // Load first question PDF preview
      if (questions.length > 0) {
        loadPdfPreview(questions[0]);
      }
    }
    
    setShowModal(true);
  };

  // ------------------------------------
  // LOAD PDF PREVIEW
  // ------------------------------------
  const loadPdfPreview = (url) => {
    setPdfLoading(true);
    try {
      if (/drive\.google\.com/.test(url)) {
        const conv = parseDriveUrl(url);
        if (conv) {
          // Use embed URL for Google Drive
          setPreviewUrl(conv.embed);
          setPdfLoading(false);
          return;
        }
      }
      // Direct URL
      if (/^https?:\/\//.test(url)) {
        setPreviewUrl(url);
        setPdfLoading(false);
        return;
      }
    } catch (e) {
      console.error("Preview load failed:", e);
    }
    setPdfLoading(false);
  };

  // ------------------------------------
  // DOWNLOAD HANDLER
  // ------------------------------------
  const downloadPdf = async () => {
    try {
      const currentUrl = modalContent[currentPdfIndex];
      if (!currentUrl) return;

      // Parse the URL to get download link
      if (/drive\.google\.com/.test(currentUrl)) {
        const conv = parseDriveUrl(currentUrl);
        if (conv) {
          window.open(conv.download, '_blank');
          return;
        }
      }

      // Direct download
      const a = document.createElement("a");
      a.href = currentUrl;
      a.download = `file-${currentPdfIndex + 1}-${Date.now()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  // ------------------------------------
  // LOADING SCREEN
  // ------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 pt-24 text-center">
          <p className="text-lg text-muted-foreground">Loading units...</p>
        </main>
      </div>
    );
  }

  // ------------------------------------
  // SUBJECT NOT FOUND
  // ------------------------------------
  if (!subject) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 pt-24 text-center">
          <p className="text-lg text-muted-foreground mb-4">Subject not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 inline" /> Back
          </button>
        </main>
      </div>
    );
  }

  // ------------------------------------
  // MAIN UI: ONLY UNITS LIST + CLICK TO PLAYLIST
  // ------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background pb-20">
      <Navigation />

      <main className="container mx-auto px-4 md:px-6 pt-6 md:pt-20">
        <div className="max-w-5xl mx-auto">

          {/* Back Button - Better Design */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/academics')}
              className="inline-flex items-center gap-2 px-3 py-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition text-sm md:text-base font-medium"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              <span>Back to Subjects</span>
            </button>
          </div>

          {/* Subject Title - Responsive */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">
              {subject.name}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Complete study material for this subject
            </p>
          </div>

          {/* UNIT LIST */}
          <div className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">
              Units ({unitsData.length})
            </h2>

            <div className="space-y-3 md:space-y-4">
              {unitsData.map((unit) => (
                <Card
                  key={unit.unit}
                  className="hover:shadow-md transition-all cursor-pointer border-l-4 border-sky-500 hover:border-sky-600"
                  onClick={() => navigate(`/playlist/${subjectId}/${unit.unit}`)}
                >
                  {/* Unit Header */}
                  <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 py-3 md:py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-base md:text-lg text-gray-900">
                          Unit {unit.unit}: {unit.title}
                        </CardTitle>
                      </div>
                      <span className="text-xl md:text-2xl text-sky-500 flex-shrink-0">→</span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* TWO COLUMN LAYOUT: Previous Papers & Important Questions - AS BUTTONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            
            {/* PREVIOUS PAPERS COLUMN */}
            <div className="border rounded-lg p-6 bg-white">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Download className="h-5 w-5 text-amber-600" />
                Previous Papers
              </h3>
              <div className="space-y-3">
                {(() => {
                  const papers = getPreviousPapers(subjectId) || [];
                  if (papers.length === 0) {
                    return <p className="text-gray-500 text-sm">No papers available</p>;
                  }
                  return (
                    <div 
                      className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded hover:shadow-md transition"
                    >
                      <p className="font-semibold text-sm md:text-base text-gray-900 mb-3">
                        {subject.name}
                      </p>
                      <button 
                        onClick={() => openModal("papers", 1)}
                        className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded text-sm font-medium transition"
                      >
                        View Papers ({papers.length})
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* IMPORTANT QUESTIONS COLUMN */}
            <div className="border rounded-lg p-6 bg-white">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-red-600" />
                Important Questions
              </h3>
              <div className="space-y-3">
                {(() => {
                  const questions = getImportantQuestions(subjectId) || [];
                  if (questions.length === 0) {
                    return <p className="text-gray-500 text-sm">No questions available</p>;
                  }
                  return (
                    <div 
                      className="p-4 border-l-4 border-red-500 bg-red-50 rounded hover:shadow-md transition"
                    >
                      <p className="font-semibold text-sm md:text-base text-gray-900 mb-3">
                        {subject.name}
                      </p>
                      <button 
                        onClick={() => openModal("questions", 1)}
                        className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition"
                      >
                        View Questions ({questions.length})
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* MODAL: View/Download Papers or Questions - LIKE ACADEMICS.JSX */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-4">
              <div className="bg-white w-full md:max-w-5xl h-screen md:h-[80vh] rounded-t-lg md:rounded-lg overflow-hidden flex flex-col md:grid md:grid-cols-[1fr_280px]">
                
                {/* MAIN PREVIEW AREA - ALLOWS PINCH ZOOM */}
                <div
                  className="flex-1 bg-gray-100 overflow-auto flex flex-col items-center justify-center p-4 md:p-6"
                  style={{ touchAction: 'pan-y pinch-zoom', WebkitOverflowScrolling: 'touch' }}
                >
                  {pdfLoading && (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-3"></div>
                      <p className="text-muted-foreground">Loading PDF...</p>
                    </div>
                  )}
                  {!pdfLoading && previewUrl && (
                    <div className="w-full h-full bg-white rounded-lg shadow overflow-hidden">
                      <PdfViewer file={previewUrl} />
                    </div>
                  )}
                  {!pdfLoading && !previewUrl && (
                    <div className="text-center">
                      <p className="text-muted-foreground">No preview available</p>
                    </div>
                  )}
                </div>

                {/* SIDEBAR: Mobile Bottom Sheet / Desktop Right Sidebar */}
                <div className="md:p-4 bg-gray-50 border-t md:border-t-0 md:border-l overflow-auto flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center px-4 md:px-0 py-2 md:py-0 mb-2 md:mb-3">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                      {modalType === "papers" ? "Previous Papers" : "Important Questions"}
                    </h3>
                    <button 
                      onClick={() => setShowModal(false)} 
                      className="p-1 hover:bg-white rounded transition"
                      title="Close"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* ACTION BUTTONS - Two Column Layout on Mobile */}
                  {modalContent.length > 0 && (
                    <div className="px-4 md:px-0 mb-3">
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:space-y-2">
                        <button 
                          onClick={downloadPdf}
                          className={`w-full px-2 py-2 text-white rounded font-medium transition text-xs flex items-center justify-center gap-1 ${
                            modalType === "papers" ? "bg-amber-500 hover:bg-amber-600" : "bg-red-500 hover:bg-red-600"
                          }`}
                          disabled={pdfLoading}
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                        <button 
                          onClick={() => {
                            const currentUrl = modalContent[currentPdfIndex];
                            if (/drive\.google\.com/.test(currentUrl)) {
                              const conv = parseDriveUrl(currentUrl);
                              if (conv) {
                                window.open(conv.view, '_blank');
                              }
                            } else {
                              window.open(currentUrl, '_blank');
                            }
                          }}
                          className="block w-full px-2 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded font-medium text-center transition text-xs flex items-center justify-center gap-1"
                          title="Open in new tab"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Open</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* INFO */}
                  <div className="px-4 md:px-0 text-xs text-muted-foreground border-t pt-2">
                    <p><strong>{modalType === "papers" ? "P" : "Q"}:</strong> {currentPdfIndex + 1}/{modalContent.length}</p>
                  </div>

                  {/* Navigation arrows removed for mobile - only Download & Open remain */}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Subject;
