import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET as searchHandler } from "../src/app/api/search/route";

function createMockSearchRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"));
}

describe("Global Search API & Data Integration Suite", () => {
  it("1. Returns empty result cleanly when query string is blank", async () => {
    const req = createMockSearchRequest("http://localhost:3000/api/search?q=");
    const res = await searchHandler(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.count, 0);
    assert.deepEqual(data.results, []);
  });

  it("2. Searches real students by name and student code", async () => {
    // Aarav Patel exists in seed students
    const req = createMockSearchRequest("http://localhost:3000/api/search?q=Aarav");
    const res = await searchHandler(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.count > 0);
    const aarav = data.results.find((r: any) => r.category === "students" && r.title.includes("Aarav"));
    assert.ok(aarav, "Should find student Aarav Patel");
    assert.equal(aarav.href, "/students/std-aarav");

    // Search by student code
    const reqCode = createMockSearchRequest("http://localhost:3000/api/search?q=MPS-4A-01");
    const resCode = await searchHandler(reqCode);
    const dataCode = await resCode.json();
    assert.ok(dataCode.count > 0);
    assert.ok(dataCode.results.some((r: any) => r.id === "std-aarav"));
  });

  it("3. Searches teachers and staff", async () => {
    const req = createMockSearchRequest("http://localhost:3000/api/search?q=Pooja");
    const res = await searchHandler(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    const teacher = data.results.find((r: any) => r.category === "teachers");
    assert.ok(teacher, "Should find teacher Pooja Sharma");
    assert.equal(teacher.title, "Pooja Sharma");
  });

  it("4. Searches remedial plans by concept and student", async () => {
    const req = createMockSearchRequest("http://localhost:3000/api/search?q=Division");
    const res = await searchHandler(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    const remedial = data.results.find((r: any) => r.category === "remedial");
    assert.ok(remedial, "Should find remedial plan for Division Basics");
    assert.equal(remedial.href, "/remedial-plans");
  });

  it("5. Filters by category when requested", async () => {
    const req = createMockSearchRequest("http://localhost:3000/api/search?q=Aarav&category=students");
    const res = await searchHandler(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.results.length > 0);
    assert.ok(data.results.every((r: any) => r.category === "students"));
  });

  it("6. Handles no matches gracefully with zero results and no crash", async () => {
    const req = createMockSearchRequest("http://localhost:3000/api/search?q=NonExistentEntityXyz999");
    const res = await searchHandler(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.count, 0);
    assert.equal(data.results.length, 0);
  });
});
