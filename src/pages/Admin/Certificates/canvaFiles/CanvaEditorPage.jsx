import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CertificateCanvas from "./CertificateCanvas";
import { BASE_URL } from "../../../../services/configUrls";

export default function CanvaEditorPage() {
    const { certificateId, versionId } = useParams(); // both IDs from route
    const token = localStorage.getItem("accessToken");

    const [jsonData, setJsonData] = useState(null);
    const [variables, setVariables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEditorData = async () => {
            try {
                // 1️⃣ Fetch all versions of the certificate
                const res = await fetch(
                    `${BASE_URL}/admin/certificate-versions/${certificateId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const data = await res.json();

                // 2️⃣ Find the version by versionId
                const version = data.versions.find(v => v.version_id === parseInt(versionId));

                if (!version) {
                    console.error("Version not found:", versionId);
                    setJsonData({ objects: [] });
                    setVariables([]);
                    setLoading(false);
                    return;
                }

                // 3️⃣ Fetch the JSON from json_url if it exists
                if (version.json_url) {
                    const jsonRes = await fetch(version.json_url);
                    const json = await jsonRes.json();
                    setJsonData(json);
                } else {
                    console.warn("No JSON found, loading blank canvas.");
                    setJsonData({ objects: [] });
                }

                // 4️⃣ Set variables for the template
                setVariables(version.variables || []);

            } catch (err) {
                console.error("Error loading template:", err);
                setJsonData({ objects: [] });
                setVariables([]);
            } finally {
                setLoading(false);
            }
        };

        if (certificateId && versionId) loadEditorData();
    }, [certificateId, versionId, token]);

    if (loading) return <div className="p-6">Loading editor...</div>;

    return (
        <CertificateCanvas
            versionId={versionId}
            token={token}
            initialJSON={jsonData}
            initialVariables={variables}
            editable={true}
        />
    );
}
