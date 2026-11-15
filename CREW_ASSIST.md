# OrbitCare Crew Assist

Crew Assist is a participant-proposed extension for a crewmate helping someone who cannot operate OrbitCare. It is a software workflow prototype, not an emergency assessment, treatment system or communication service.

## Use the workflow

1. Choose **Help a crewmate**, available beside **Monitor my health** in every workspace. No reading, flag or completed check-in is required.
2. Read the urgent guidance first: use the mission’s actual approved emergency procedures and summon designated trained medical personnel through the mission’s actual channels. The existing **Urgent concern** dialog uses the same guidance.
3. If appropriate after the immediate response is underway, choose **Document an incident (optional)**. Use a fictional identifier in this prototype. Record circumstances, source, event time, measured-observation notes, missing information, reported actions, contact statements and notes. Blank remains unknown.
4. Optionally include historical context only after confirming that the selected workspace belongs to the same fictional crewmember. This copies the selected mission day and local review events through that day, with original source/timestamp labels. It does not fill current observations or verify identity.
5. Save locally or prepare a handoff. Download incident JSON or readable text, or choose **Print / Save as PDF** using the browser’s print dialog. Exporting or printing notifies nobody.
6. Saved records are collapsed on re-entry. Open **Show local incident records** to inspect, import a separate incident export or explicitly delete a local record. Downloaded copies are not deleted by OrbitCare.

**No approved mission-specific emergency protocol is installed in this prototype.** No approved protocol was supplied for this release. NASA standards are linked research context, not installed treatment procedures. There is no protocol installer or verifier.

## Crew Emergency Drill

**Start Crew Emergency Drill** loads a deterministic fictional Mars mission-day-24 report: an assisting user reports finding SIM-CREW-01 unresponsive and unable to operate the app. It is not an application detection. The drill presents guidance, optional documentation and a handoff; every stage is labeled simulation/training only.

The scenario’s event/creation clock is fixed and explicitly fictional. No vital signs, treatment actions, medical contact, clinical score or outcome are supplied. Your edits stay within the synthetic drill. Current observation and contact fields begin unknown; history begins excluded. The drill demonstrates software, not competence in emergency medicine.

## Sources and boundaries

[NASA Health and Medical Care](https://www.nasa.gov/reference/3-0-health-and-medical-care/) §§3.1 and 3.5 describe designated medical responsibility and recording encounters/observations in a mission-dependent system. [NASA Medical Training](https://www.nasa.gov/reference/5-0-training/) §§5.1–5.2.2 describes role-specific training and its verification. These inform responsibility boundaries; OrbitCare’s form is an unvalidated engineering interpretation, not an approved clinical handoff format.

[Five Hazards](https://www.nasa.gov/hrp/hazards/) supports the distance-from-Earth context. [HRP Risks](https://www.nasa.gov/hrp/risks/) establishes broad human-health scope. [Standard Measures](https://www.nasa.gov/reference/standard-measures/) supports distinguishing time-labeled longitudinal context from current observations. None supplies an emergency algorithm or validates this drill. Original OSD-575 data remains separate and unchanged.

## Local data and offline operation

Incident registry v1 uses the existing `orbitcare` IndexedDB database and `state` object store under a separate `crew-incidents` key. Monitoring schema v1, its workspace import/export and its flags remain unchanged. Incident JSON has its own strict schema, bounds, source labels and timestamps; imports receive a new ID and import timestamp. At most 50 incidents are stored.

After **Offline ready**, the shared guidance, previously unvisited Crew Assist, drill, local save/reload, explicit historical snapshot, JSON/text export and printable handoff can work offline. External NASA pages and actual mission communication channels require their own connectivity and systems. Browser print/PDF behavior depends on the browser and OS.

Storage errors are reported; existing invalid records are not overwritten. A session handoff can still be exported. Unsaved edits trigger a leave/reload guard. Records are visible to anyone using the same browser profile; OrbitCare provides no encryption, authentication, production medical security or synchronized multi-device crew access. Public demonstrations use synthetic information only.

Implementation, executed verification and deployment status are recorded in the newest QA_REPORT.md and DEPLOYMENT.md entries. Software tests are not clinical, operational or astronaut usability validation.
