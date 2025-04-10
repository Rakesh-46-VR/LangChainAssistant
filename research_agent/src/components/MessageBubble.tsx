import { cn } from "@/lib/utils"
import type { Message } from "@/types/chat"
import { User, Bot } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex items-start gap-2 max-w-[80%]", isUser ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
            isUser ? "bg-indigo-600" : "bg-zinc-700",
          )}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        <div className={cn("px-4 py-3 rounded-lg", isUser ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-100")}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-3" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-md font-bold my-2" {...props} />,
                  p: ({ node, ...props }) => <p className="my-2" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                  li: ({ node, ...props }) => <li className="my-1" {...props} />,
                  a: ({ node, ...props }) => (
                    <a
                      className="text-indigo-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  code: ({ node, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || "")
                    const isInline = !className

                    if (isInline) {
                      return (
                        <code className="bg-zinc-900 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      )
                    }

                    return (
                      <pre className="bg-zinc-900 p-3 rounded-md my-2 overflow-x-auto">
                        <code
                          className={match ? `language-${match[1]} text-sm font-mono` : "text-sm font-mono"}
                          {...props}
                        >
                          {children}
                        </code>
                      </pre>
                    )
                  },
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-zinc-600 pl-4 italic my-2" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-2">
                      <table className="min-w-full border-collapse" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-zinc-700 px-4 py-2 text-left font-bold" {...props} />
                  ),
                  td: ({ node, ...props }) => <td className="border border-zinc-700 px-4 py-2" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          <div className={cn("text-xs mt-1 opacity-70", isUser ? "text-right" : "text-left")}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}
