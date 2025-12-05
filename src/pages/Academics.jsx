import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Video, FileText, Download, Star } from "lucide-react";
import { JNTUK_COLLEGES } from "@/data/jntukColleges";
import { SYLLABUS_TREE } from "@/data/syllabus/syllabusIndex";



const Academics = () => {
  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");
  const [collegeQuery, setCollegeQuery] = useState("");
  const [collegeOpen, setCollegeOpen] = useState(false);
  const [regulation, setRegulation] = useState("");
  const [subBranch, setSubBranch] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [pdfPageCount, setPdfPageCount] = useState(0);

  // Restore persisted selections from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("knowra_academics_selection");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.university) setUniversity(parsed.university);
      if (parsed.regulation) setRegulation(parsed.regulation);
      if (parsed.college) setCollege(parsed.college);
      if (parsed.branch) setBranch(parsed.branch);
      if (parsed.subBranch) setSubBranch(parsed.subBranch);
      if (parsed.year) setYear(parsed.year);
      if (parsed.semester) setSemester(parsed.semester);
    } catch (e) {
      // ignore parse errors
      // console.warn('Failed to restore selections', e)
    }
  }, []);

  // Persist selections whenever they change
  useEffect(() => {
    const payload = {
      university,
      regulation,
      college,
      branch,
      subBranch,
      year,
      semester,
    };
    try {
      localStorage.setItem(
        "knowra_academics_selection",
        JSON.stringify(payload)
      );
    } catch (e) {
      // ignore
    }
  }, [university, regulation, college, branch, subBranch, year, semester]);

  const showSubjects = university && college && branch && year && semester && (branch !== 'cse' || subBranch);
  
  // ⭐ GET REAL SUBJECTS BASED ON SELECTED DETAILS  
const getSubjects = () => {
  const uni = university;
  const reg = regulation;
  const br = subBranch || branch;
  const semKey = `${year}-${semester}`;

  const data = SYLLABUS_TREE?.[uni]?.[reg]?.[br]?.[semKey];
  return data?.subjects || [];
};
const subjects = getSubjects();
const getSyllabusPdf = () => {
  const uni = university;
  const reg = regulation;
  const br = subBranch || branch;
  const semKey = `${year}-${semester}`;

  const data = SYLLABUS_TREE?.[uni]?.[reg]?.[br]?.[semKey];
  return data?.syllabus_pdf || "";
};

  const filteredJntuk = useMemo(
    () =>
      JNTUK_COLLEGES.filter((clg) =>
        clg.toLowerCase().includes(collegeQuery.toLowerCase())
      ),
    [collegeQuery]
  );

  const filteredOthers = useMemo(
    () =>
      ["CBIT", "VNR VJIET", "CVSR"].filter((c) =>
        c.toLowerCase().includes(collegeQuery.toLowerCase())
      ),
    [collegeQuery]
  );

// Helper: convert Google Drive sharing links to embeddable preview/download URLs
const parseDriveUrl = (url) => {
  try {
    const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (m && m[1]) {
      const id = m[1];
      return {
        preview: `https://drive.google.com/file/d/${id}/preview`,
        download: `https://drive.google.com/uc?export=download&id=${id}`,
      };
    }
  } catch (e) {}
  return null;
};

  // cleanup object URL when viewer is closed
  useEffect(() => {
    if (openPdf) return; // only run cleanup when modal is closed
    if (pdfBlobUrl) {
      try { URL.revokeObjectURL(pdfBlobUrl); } catch (e) {}
      setPdfBlobUrl("");
    }
    setPreviewUrl("");
    setPdfError("");
  }, [openPdf]);

  // Try to fetch PDF quickly from backend API (FastAPI). If not available, fallback to static URL.
  const fetchSyllabusPdf = async () => {
    setPdfError("");
    setPdfLoading(true);
    try {
      // Fast path: if the syllabus JSON already includes a direct URL, use it immediately
      const staticUrl = getSyllabusPdf();
      if (staticUrl) {
        if (/drive\.google\.com/.test(staticUrl)) {
          const conv = parseDriveUrl(staticUrl);
          if (conv) {
            setPdfBlobUrl("");
            setPreviewUrl(conv.preview);
            setPdfLoading(false);
            return conv.preview;
          }
        }
        // other absolute URL
        if (/^https?:\/\//.test(staticUrl)) {
          setPdfBlobUrl("");
          setPreviewUrl(staticUrl);
          setPdfLoading(false);
          return staticUrl;
        }
      }

      // Backend endpoint (expected to return application/pdf or JSON { url: string })
      const uni = encodeURIComponent(university || "");
      const reg = encodeURIComponent(regulation || "");
      const br = encodeURIComponent(subBranch || branch || "");
      const semKey = `${year}-${semester}`;
      const params = new URLSearchParams({ uni, reg, br, sem: semKey });

      const apiUrl = `/api/syllabus/pdf?${params.toString()}`;

      const resp = await fetch(apiUrl, { method: "GET" });

      if (resp.ok) {
        const contentType = resp.headers.get("content-type") || "";
        if (contentType.includes("application/pdf")) {
          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          // cleanup previous
          if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
          setPdfBlobUrl(url);
          setPreviewUrl(url);
          setPdfLoading(false);
          return url;
        }

        // maybe backend responded with JSON containing url
        try {
          const json = await resp.json();
          if (json && json.url) {
            // if backend returned a drive link, convert to preview
            if (/drive\.google\.com/.test(json.url)) {
              const conv = parseDriveUrl(json.url);
              if (conv) {
                setPdfBlobUrl("");
                setPreviewUrl(conv.preview);
                setPdfLoading(false);
                return conv.preview;
              }
            }
            setPdfBlobUrl("");
            setPreviewUrl(json.url);
            setPdfLoading(false);
            return json.url;
          }
        } catch (e) {
          // not JSON
        }
      }

      // fallback to static path built by frontend
      const fallback = buildSyllabusUrl();
      setPdfBlobUrl("");
      setPreviewUrl(fallback);
      setPdfLoading(false);
      return fallback;
    } catch (e) {
      setPdfError("Failed to fetch syllabus PDF");
      setPdfLoading(false);
      const fallback2 = buildSyllabusUrl();
      setPreviewUrl(fallback2);
      return fallback2;
    }
  };

  // Download handler: if we have blob URL, fetch the blob and download; else trigger direct download
  const downloadPdf = async () => {
    try {
      if (pdfBlobUrl) {
        // blob url already available
        const a = document.createElement("a");
        a.href = pdfBlobUrl;
        a.download = `${slugify(university || "syllabus")}-${year}-${semester}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      // try to fetch and get blob
      setPdfLoading(true);
      const url = await fetchSyllabusPdf();
      if (!url) throw new Error("No URL");

      // if url is a remote link, just open it for download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(university || "syllabus")}-${year}-${semester}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setPdfLoading(false);
    } catch (e) {
      setPdfError("Download failed");
      setPdfLoading(false);
    }
  };

  const SUB_BRANCHES = {
    cse: [
      "CSE",
      "CSE (Artificial Intelligence and Data Science)",
      "CSE (Data Science)",
      "CSE (Artificial Intelligence)",
      "CSE (Artificial Intelligence and Machine Learning)",
      "CSE (Cyber Security)",
      "CSE (Internet of Things)",
    ],
  };

  // Small inner component: dropdown for colleges
  const CollegeDropdown = ({ open, onClose, query, setQuery, onSelect, university, filteredJntuk, filteredOthers }) => {
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
      if (!open) return;
      const onDocClick = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          onClose();
        }
      };
      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [open, onClose]);

    useEffect(() => {
      if (open) {
        // focus after render
        setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
      }
    }, [open]);

    if (!open) return null;

    const list = university === 'jntuk'
      ? (filteredJntuk.length ? filteredJntuk : JNTUK_COLLEGES)
      : (filteredOthers.length ? filteredOthers : ["CBIT", "VNR VJIET", "CVSR"]);




    return (
      <div ref={containerRef} className="absolute z-50 left-0 mt-1 bg-white text-black border shadow-md rounded-md max-h-80 overflow-hidden w-full md:w-auto md:min-w-[36rem] lg:min-w-[48rem]">
        <div className="p-2 border-b sticky top-0 bg-white">
          <input
            ref={inputRef}
            aria-label="Search colleges"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm bg-white text-black"
            placeholder="Search colleges..."
          />
        </div>

        <div className="max-h-64 overflow-auto">
          {list.map((clg, i) => (
            <div
              key={i}
              role="option"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(clg)}
              className="px-4 py-2 hover:bg-sky-500 hover:text-white cursor-pointer truncate whitespace-nowrap overflow-hidden transition-colors"
            >
              <span className="block truncate">{clg}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-6 pt-10 md:pt-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">Academics</h1>
            <button
              onClick={() => {
                setUniversity("");
                setCollege("");
                setCollegeQuery("");
                setRegulation("");
                setBranch("");
                setSubBranch("");
                setYear("");
                setSemester("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition"
            >
              Clear All
            </button>
          </div>
          <p className="text-muted-foreground mb-12 text-lg">
            Select your details to access course materials, video lectures, and previous papers.
          </p>

          {/* --- Selection Section --- */}
          <div className={`grid grid-cols-1 md:grid-cols-6 gap-6 mb-12`}>

            {/* University */}
            <Select
              value={university}
              onValueChange={(value) => {
                setUniversity(value);
                setCollege("");
                setCollegeQuery("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select University" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-md rounded-md">
                <SelectItem value="jntuk">JNTUK</SelectItem>
                <SelectItem value="jntuh">JNTUH</SelectItem>
                <SelectItem value="jntua">JNTUA</SelectItem>
                <SelectItem value="au">Andhra University (AU)</SelectItem>
                <SelectItem value="os">Osmania University (OS)</SelectItem>
              </SelectContent>
            </Select>

            {/* College - Custom Searchable Combobox */}
            {/* Regulation (appears after selecting University) */}
            <Select value={regulation} onValueChange={(val) => {
              setRegulation(val);
              // reset dependent fields when regulation changes
              setCollege("");
              setCollegeQuery("");
              setBranch("");
              setSubBranch("");
              setYear("");
              setSemester("");
            }} disabled={!university}>
              <SelectTrigger>
                <SelectValue placeholder="Select Regulation" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-md rounded-md">
                <SelectItem value="r23">R23</SelectItem>
                <SelectItem value="r26">R26</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <button
                type="button"
                className={`w-full text-left px-3 py-2 border rounded-md bg-white ${!university ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (!university) return;
                  setCollegeQuery("");
                  setCollegeOpen((o) => !o);
                }}
                disabled={!university}
              >
                <span className="block truncate">{college || 'Select College'}</span>
              </button>

              {/** Dropdown */}
              {typeof window !== 'undefined' && (
                <CollegeDropdown
                  open={!!collegeOpen}
                  onClose={() => setCollegeOpen(false)}
                  query={collegeQuery}
                  setQuery={setCollegeQuery}
                  onSelect={(val) => {
                    setCollege(val);
                    setCollegeQuery("");
                    setCollegeOpen(false);
                  }}
                  university={university}
                  filteredJntuk={filteredJntuk}
                  filteredOthers={filteredOthers}
                />
              )}
            </div>

            {/* Branch */}
            <Select value={branch} onValueChange={(val) => { setBranch(val); if (val !== 'cse') setSubBranch(''); }} disabled={!college}>
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-md rounded-md">
                <SelectItem value="cse">Computer Science</SelectItem>
                <SelectItem value="ece">Electronics</SelectItem>
                <SelectItem value="mech">Mechanical</SelectItem>
                <SelectItem value="civil">Civil</SelectItem>
              </SelectContent>
            </Select>

            {/* Sub-branch (only for CSE) */}
            {branch === 'cse' && (
              <Select value={subBranch} onValueChange={setSubBranch} disabled={!branch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Specialization" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black shadow-md rounded-md">
                  {SUB_BRANCHES.cse.map((s, i) => (
                    <SelectItem key={i} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Year */}
            <Select value={year} onValueChange={(val) => { setYear(val); setSemester(""); }} disabled={!branch}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-md rounded-md">
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Semester (depends on Year) */}
            <Select value={semester} onValueChange={setSemester} disabled={!year}>
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-md rounded-md">
                {year === "1" && (
                  <>
                    <SelectItem value="1">1st Semester</SelectItem>
                    <SelectItem value="2">2nd Semester</SelectItem>
                  </>
                )}
                {year === "2" && (
                  <>
                    <SelectItem value="3">1st Semester</SelectItem>
                    <SelectItem value="4">2nd Semester</SelectItem>
                  </>
                )}
                {year === "3" && (
                  <>
                    <SelectItem value="5">1st Semester</SelectItem>
                    <SelectItem value="6">2nd Semester</SelectItem>
                  </>
                )}
                {year === "4" && (
                  <>
                    <SelectItem value="7">1st Semester</SelectItem>
                    <SelectItem value="8">2nd Semester</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

          </div>

          {/* --- Subjects Section --- */}
          {showSubjects && (
            <>
              {/* Syllabus card (constructed URL) */}
             <div className="mb-6">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-sky-500" />
          Syllabus
        </span>

        {/* RIGHT SIDE BUTTONS */}
        {getSyllabusPdf() ? (
          <div className="flex items-center gap-3">
            <button
              onClick={async () => { await fetchSyllabusPdf(); setOpenPdf(true); }}
              className="px-3 py-1 border rounded-md bg-white text-sm hover:bg-gray-50"
            >
              View
            </button>

            <button
              onClick={downloadPdf}
              className="px-3 py-1 border rounded-md bg-white text-sm hover:bg-gray-50"
              disabled={pdfLoading}
            >
              {pdfLoading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            Syllabus not available
          </span>
        )}

      </CardTitle>
    </CardHeader>
  </Card>
</div>

              {/* PDF Viewer Modal (responsive) */}
              {openPdf && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-4">
                  <div className="bg-white w-full md:max-w-5xl h-screen md:h-[80vh] rounded-t-lg md:rounded-lg overflow-hidden flex flex-col md:grid md:grid-cols-[2fr,1fr]">
                    {/* PDF Viewer Area - takes more space */}
                    <div className="flex-1 bg-gray-100 flex flex-col relative md:order-1 order-1">
                      {pdfLoading && (
                        <div className="flex items-center justify-center h-full">Preparing syllabus preview...</div>
                      )}
                      {pdfError && (
                        <div className="p-4 text-red-600">{pdfError}</div>
                      )}
                      {!pdfLoading && previewUrl && (
                        <>
                          <iframe src={previewUrl} title="Syllabus PDF" className="w-full flex-1 border-none" />
                          {/* Mobile-only: Page counter and nav at bottom */}
                          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                            <button className="p-2 hover:bg-gray-100 rounded disabled:opacity-50" disabled>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <span className="text-sm font-medium text-gray-700">Page 1 / 3</span>
                            <button className="p-2 hover:bg-gray-100 rounded">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                      {!pdfLoading && !previewUrl && (
                        <div className="p-4">No preview available for this selection.</div>
                      )}
                    </div>

                    {/* Sidebar - Info and Controls */}
                    <div className="md:order-2 order-2 bg-white md:bg-gray-50 border-t md:border-t-0 md:border-l overflow-auto flex flex-col">
                      {/* Header */}
                      <div className="p-4 border-b md:border-b flex justify-between items-center">
                        <h3 className="text-sm md:text-base font-semibold">Syllabus Preview</h3>
                        <button onClick={() => setOpenPdf(false)} className="px-2 py-1 border rounded text-sm hover:bg-gray-50">Close</button>
                      </div>

                      {/* Buttons */}
                      <div className="p-4 space-y-2 flex flex-col">
                        <button onClick={downloadPdf} className="w-full px-3 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded text-sm font-semibold" disabled={pdfLoading}>
                          {pdfLoading ? 'Preparing...' : 'Download PDF'}
                        </button>
                        <a href={previewUrl || getSyllabusPdf()} target="_blank" rel="noreferrer" className="w-full text-center px-3 py-3 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">
                          Open in new tab
                        </a>
                      </div>

                      {/* Info Section */}
                      <div className="px-4 pb-4 border-t text-xs text-muted-foreground space-y-1">
                        <p><strong>University:</strong> {university}</p>
                        <p><strong>Regulation:</strong> {regulation}</p>
                        <p><strong>Branch:</strong> {branch}{subBranch ? ` / ${subBranch}` : ''}</p>
                        <p><strong>Year/Sem:</strong> {year} / {semester}</p>
                      </div>

                      <div className="px-4 pb-4 text-xs text-muted-foreground">Tap outside or press Close to exit.</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                  <Link
                    key={subject.id}
                    to={`/academics/subject/${encodeURIComponent(subject.id)}`}
                    className="no-underline"
                  >
                    <Card className="group hover:shadow-lg transition-all cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-sky-500" />
                          {subject.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center text-sm">
                          <span className="flex items-center gap-3 text-muted-foreground">
                            <FileText className="h-4 w-4 flex-shrink-0" />
                            Study Materials
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="flex items-center gap-3 text-muted-foreground">
                            <Video className="h-4 w-4 flex-shrink-0" />
                            Video Lectures
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <span className="flex items-center gap-3 text-muted-foreground">
                              <Download className="h-4 w-4 flex-shrink-0" />
                              Previous Papers
                            </span>
                          </div>

                          <div className="flex items-center text-sm">
                            <span className="flex items-center gap-3 text-muted-foreground">
                              <Star className="h-4 w-4 flex-shrink-0 text-black" />
                              IMP Questions
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}

          {!showSubjects && (
            <div className="text-center py-20">
              <BookOpen className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                Select your university, college, branch, and semester to view subjects
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Academics;
