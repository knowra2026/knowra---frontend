import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, ArrowRight, Play, FileText, Clock, Download, X, ExternalLink } from "lucide-react";
import { getUnit } from "@/data/syllabus/jntuk/r23/cse-ai-ml/units/unitsIndex.js";

// Load subject file
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

const Playlist = () => {
  const { subjectId, unitNumber } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [unit, setUnit] = useState(null);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  // Video loading / processing state when user starts a topic
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  // Autoplay flag for embed URL (used to autoplay first topic muted)
  const [autoplay, setAutoplay] = useState(false);
  // PDF modal state
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      
      // Load subject info
      const subjectFile = await loadSubjectFile(subjectId);
      
      // Load unit data from preloaded unitsMap
      const unitFile = getUnit(subjectId, parseInt(unitNumber));

      setSubject(subjectFile);
      setUnit(unitFile);
      setCurrentTopicIndex(0);
      // default: autoplay the first topic when a unit loads (muted)
      setAutoplay(true);
      setIsLoadingVideo(true);
      setLoading(false);
    };

    loadAll();
  }, [subjectId, unitNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-3"></div>
            <p className="text-muted-foreground">Loading playlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!unit || !subject) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 pt-24 text-center">
          <p className="text-lg text-muted-foreground mb-4">Unit not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 border rounded bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </main>
      </div>
    );
  }

  const topics = unit.topics || [];
  const currentTopic = topics[currentTopicIndex];

  // Helper to build YouTube embed URL with optional autoplay/mute
  const getEmbedUrl = (url, auto = false) => {
    if (!url) return "";
    try {
      const embedBase = url.replace("watch?v=", "embed/");
      if (auto) {
        // autoplay=1 and mute=1 to increase chance autoplay works on browsers
        return embedBase + (embedBase.includes("?") ? "&" : "?") + "autoplay=1&mute=1";
      }
      return embedBase;
    } catch (e) {
      return url;
    }
  };

  // Helper to parse Google Drive URL
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

  // Open PDF modal
  const openPdfModal = () => {
    if (unit?.pdf) {
      setPdfLoading(true);
      try {
        if (/drive\.google\.com/.test(unit.pdf)) {
          const conv = parseDriveUrl(unit.pdf);
          if (conv) {
            setPreviewUrl(conv.embed);
            setPdfLoading(false);
          }
        } else if (/^https?:\/\//.test(unit.pdf)) {
          setPreviewUrl(unit.pdf);
          setPdfLoading(false);
        }
      } catch (e) {
        console.error("PDF preview load failed:", e);
        setPdfLoading(false);
      }
      setShowPdfModal(true);
    }
  };

  // Download PDF
  const downloadPdf = () => {
    if (!unit?.pdf) return;
    try {
      if (/drive\.google\.com/.test(unit.pdf)) {
        const conv = parseDriveUrl(unit.pdf);
        if (conv) {
          window.open(conv.download, '_blank');
          return;
        }
      }
      // Direct download
      const a = document.createElement("a");
      a.href = unit.pdf;
      a.download = `unit-${unit.unit}-notes-${Date.now()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background pb-10">
      <Navigation />

      <main className="container mx-auto px-4 md:px-6 pt-6 md:pt-20">
        <div className="max-w-7xl mx-auto">

          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(`/academics/subject/${subjectId}`)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition text-sm md:text-base font-medium"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              <span>Back to Subject</span>
            </button>
          </div>

          {/* Header Info */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              {subject?.name}
            </h1>
            <h2 className="text-lg md:text-2xl font-semibold text-sky-600 mb-1">
              Unit {unit.unit}: {unit.title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {topics.length} topic{topics.length !== 1 ? 's' : ''} to learn
            </p>
          </div>

          {/* Main Grid: Sidebar (left) + Video Player (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

            {/* LEFT SIDEBAR: Unit title, topics list, PDF button */}
            {/* On mobile the sidebar should appear after the video; on lg it stays left */}
            <aside className="order-2 lg:order-1">
              <div className="bg-white rounded-lg border border-border/20 shadow-sm h-full flex flex-col overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="text-base font-semibold">Unit {unit.unit}: {unit.title}</h3>
                </div>

                <div className="p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                  <nav className="space-y-2">
                    {topics.map((t, index) => {
                      const active = index === currentTopicIndex;
                      return (
                        <button
                          key={index}
                          onClick={() => { setIsLoadingVideo(true); setAutoplay(false); setCurrentTopicIndex(index); }}
                          className={`w-full text-left px-3 py-2 transition flex items-center gap-3 ${
                            active
                              ? 'bg-sky-50 border-l-4 border-sky-500 rounded-md shadow-sm'
                              : 'hover:bg-gray-50 rounded-md'
                          }`}
                        >
                          <span className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-full ${active ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{index + 1}</span>
                          <span className="text-sm truncate">{t.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="p-4">
                  {/* Play First Topic button - prominent CTA */}
                  <button
                    onClick={() => { setIsLoadingVideo(true); setAutoplay(true); setCurrentTopicIndex(0); }}
                    className="w-full mb-3 px-3 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold text-center"
                  >
                    Play First Topic
                  </button>

                  <div className="mt-2">
                    {unit.pdf && (
                      <button
                        onClick={openPdfModal}
                        className="w-full text-center px-3 py-2 bg-gray-100 rounded font-medium hover:bg-gray-200 transition"
                      >
                        TOTAL UNIT PDF NOTES
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT MAIN: Topic title, large video, centered nav buttons */}
            {/* On mobile show video first */}
            <section className="order-1 lg:order-2">
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">{currentTopic?.title || 'Select a Topic'}</h2>

                <div className="flex justify-center">
                  <div className="w-full max-w-3xl">
                    <div className="bg-black aspect-video relative">
                      <div className="absolute inset-0">
                        {currentTopic?.video ? (
                              <iframe
                                width="100%"
                                height="100%"
                                className="w-full h-full"
                                src={getEmbedUrl(currentTopic.video, autoplay)}
                                title={currentTopic.title}
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                onLoad={() => { setIsLoadingVideo(false); setAutoplay(false); }}
                              />
                            ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Play className="h-20 w-20 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {isLoadingVideo && (
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-20">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-sky-200 border-b-4 border-sky-500 mb-3"></div>
                          <p className="text-white font-medium">Processing…</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center gap-6 mt-6">
                      <button
                        aria-label="Previous Topic"
                        disabled={currentTopicIndex === 0}
                        onClick={() => { setIsLoadingVideo(true); setAutoplay(false); setCurrentTopicIndex(currentTopicIndex - 1); }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                      >
                        <ArrowLeft className="h-4 w-4 text-gray-700" />
                        <span className="text-sm font-medium">Previous Topic</span>
                      </button>

                      <button
                        aria-label="Next Topic"
                        disabled={currentTopicIndex === topics.length - 1}
                        onClick={() => { setIsLoadingVideo(true); setAutoplay(false); setCurrentTopicIndex(currentTopicIndex + 1); }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                      >
                        <span className="text-sm font-medium">Next Topic</span>
                        <ArrowRight className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Mobile-only PDF / Official links (duplicate for easy access) */}
                    <div className="mt-4 lg:hidden flex flex-col gap-2">
                      {unit.pdf && (
                        <button
                          onClick={openPdfModal}
                          className="block text-center px-3 py-2 bg-gray-100 rounded font-medium hover:bg-gray-200 transition"
                        >
                          TOTAL UNIT PDF NOTES
                        </button>
                      )}

                      {(subject?.syllabus_pdf || subject?.officialUrl || subject?.website) && (
                        <a
                          href={subject?.syllabus_pdf || subject?.officialUrl || subject?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center px-3 py-2 bg-white border rounded font-medium hover:bg-gray-50"
                        >
                          Official Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* PDF MODAL: View/Download Unit PDF */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-4">
          <div className="bg-white w-full md:max-w-5xl h-screen md:h-[80vh] rounded-t-lg md:rounded-lg overflow-hidden flex flex-col md:grid md:grid-cols-[1fr_280px]">
            
            {/* MAIN PREVIEW AREA */}
            <div className="flex-1 bg-gray-100 overflow-auto flex flex-col items-center justify-center p-4 md:p-6">
              {pdfLoading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-3"></div>
                  <p className="text-muted-foreground">Loading PDF...</p>
                </div>
              )}
              {!pdfLoading && previewUrl && (
                <div className="w-full h-full bg-white rounded-lg shadow overflow-hidden">
                  <iframe 
                    src={previewUrl} 
                    title="Unit PDF Document" 
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
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
                  Unit {unit?.unit} PDF
                </h3>
                <button 
                  onClick={() => setShowPdfModal(false)} 
                  className="p-1 hover:bg-white rounded transition"
                  title="Close"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* ACTION BUTTONS */}
              <div className="px-4 md:px-0 mb-3">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:space-y-2">
                  <button 
                    onClick={downloadPdf}
                    className="w-full px-2 py-2 text-white bg-sky-500 hover:bg-sky-600 rounded font-medium transition text-xs flex items-center justify-center gap-1"
                    disabled={pdfLoading}
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (/drive\.google\.com/.test(unit.pdf)) {
                        const conv = parseDriveUrl(unit.pdf);
                        if (conv) {
                          window.open(conv.view, '_blank');
                        }
                      } else {
                        window.open(unit.pdf, '_blank');
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

              {/* INFO */}
              <div className="px-4 md:px-0 text-xs text-muted-foreground border-t pt-2">
                <p><strong>File:</strong> {unit?.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;
