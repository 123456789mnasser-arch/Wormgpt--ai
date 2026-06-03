import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File, Image, Code, Mic, Link, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface FileUploadProps {
  onFileSelect: (file: { name: string; type: string; url: string; size: number }) => void;
  conversationId: number;
}

export default function FileUpload({ onFileSelect, conversationId }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const uploadFileMutation = trpc.files.uploadFile.useMutation();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const fileUrl = URL.createObjectURL(file);

      await uploadFileMutation.mutateAsync({
        filename: file.name,
        fileType: getFileType(file.type),
        fileUrl,
        fileKey: `${conversationId}/${file.name}`,
        fileSize: file.size,
        mimeType: file.type,
      });

      clearInterval(interval);
      setUploadProgress(100);

      onFileSelect({
        name: file.name,
        type: getFileType(file.type),
        url: fileUrl,
        size: file.size,
      });

      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 1000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("المتصفح لا يدعم تسجيل الصوت");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);

          await uploadFileMutation.mutateAsync({
            filename: `audio-${Date.now()}.wav`,
            fileType: "audio",
            fileUrl: audioUrl,
            fileKey: `${conversationId}/audio-${Date.now()}.wav`,
            fileSize: audioBlob.size,
            mimeType: "audio/wav",
          });

          onFileSelect({
            name: `audio-${Date.now()}.wav`,
            type: "audio",
            url: audioUrl,
            size: audioBlob.size,
          });

          stream.getTracks().forEach((track) => track.stop());
        } catch (e) {
          console.error("Error processing audio:", e);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error: any) {
      console.error("Error accessing microphone:", error);
      if (error.name === "NotAllowedError") {
        alert("يرجى السماح بالوصول إلى الميكروفون");
      } else if (error.name === "NotFoundError") {
        alert("لم يتم العثور على ميكروفون");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith("image")) return "image";
    if (mimeType.startsWith("audio")) return "audio";
    if (mimeType.includes("code") || mimeType.includes("text")) return "code";
    if (mimeType.includes("pdf") || mimeType.includes("document")) return "document";
    return "file";
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.py,.js,.ts,.java,.cpp,.c,.rb,.go,.rs,.php,.html,.css,.json,.xml,.pdf,.doc,.docx"
      />

      <Button
        size="sm"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading || isRecording}
        className="border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000] hover:text-white"
        title="رفع ملف"
      >
        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={isRecording ? stopRecording : startRecording}
        className={`border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black ${isRecording ? "bg-[#00FF41]" : ""}`}
        title={isRecording ? "إيقاف" : "تسجيل"}
      >
        <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />
      </Button>

      {isUploading && (
        <div className="flex-1 min-w-[200px]">
          <Progress value={uploadProgress} className="h-1" />
          <p className="text-xs text-gray-400 mt-1">{uploadProgress}%</p>
        </div>
      )}
    </div>
  );
}
