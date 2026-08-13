"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import Card from "@/components/Card";
import { Badge } from "@/components/Badge";
import { formatDate, riskColor } from "@/lib/utils";

export default function CandidateProfilePage() {
  const { id } = useParams(); // keep candidate_id as string
  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    "/completed-sessions?limit=100"
  );

  if (isLoading) {
    return (
      <div className="p-6">
        Loading candidate profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        Failed to load candidate profile.
      </div>
    );
  }

  const allSessions = data?.sessions || [];

  const interviews = allSessions.filter(
    (session) => String(session.candidate_id) === String(id)
  );

  const candidate = interviews[0];

  if (!candidate) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">
          Candidate Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card
        title={candidate.candidate_id}
        description="Candidate Profile"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted">Candidate ID</p>
            <p className="font-mono">
              {candidate.candidate_id}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted">Name</p>
            <p>{candidate.name || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-muted">Email</p>
            <p>{candidate.email || "N/A"}</p>
          </div>

          <div>
            <p className="text-sm text-muted">Skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(candidate.skills || []).map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted">Resume</p>
            <div className="mt-2 rounded-md border border-border bg-bg-card p-3">
              {candidate.resume_text || "Resume not available"}
            </div>
          </div>

          <button
            onClick={() =>
              router.push(`/interview?candidate_id=${candidate.candidate_id}`)
            }
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Schedule Interview
          </button>
        </div>
      </Card>

      <Card
        title="Interview History"
        description={`${interviews.length} interview(s)`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="py-2 text-left">Session ID</th>
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Score</th>
                <th className="py-2 text-left">Risk Level</th>
              </tr>
            </thead>

            <tbody>
              {interviews.map((interview) => (
                <tr
                  key={interview.session_id}
                  className="border-t border-border"
                >
                  <td className="py-2">
                    {interview.session_id}
                  </td>

                  <td className="py-2">
                    {formatDate(
                      interview.updated_at ||
                        interview.end_time
                    )}
                  </td>

                  <td className="py-2">
                    {interview.status}
                  </td>

                  <td className="py-2">
                    {interview.score ?? "—"}
                  </td>

                  <td className="py-2">
                    {interview.risk_score != null ? (
                      <Badge
                        variant={riskColor(
                          interview.risk_score
                        )}
                      >
                        {interview.risk_score.toFixed(2)}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}