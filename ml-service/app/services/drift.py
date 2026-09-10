import numpy as np
from typing import Dict, Any, List
from scipy.stats import ks_2samp
from datetime import datetime

class DriftService:
    @staticmethod
    def calculate_psi(baseline: np.ndarray, current: np.ndarray, bins: int = 10) -> float:
        """Calculates Population Stability Index (PSI) between baseline and current distributions."""
        if len(baseline) == 0 or len(current) == 0:
            return 0.0

        quantiles = np.linspace(0, 100, bins + 1)
        bin_edges = np.percentile(baseline, quantiles)
        bin_edges[0] -= 1e-5
        bin_edges[-1] += 1e-5

        b_counts, _ = np.histogram(baseline, bins=bin_edges)
        c_counts, _ = np.histogram(current, bins=bin_edges)

        b_pct = np.clip(b_counts / len(baseline), 1e-4, 1.0)
        c_pct = np.clip(c_counts / len(current), 1e-4, 1.0)

        psi_val = np.sum((c_pct - b_pct) * np.log(c_pct / b_pct))
        return float(psi_val)

    @classmethod
    def evaluate_drift(cls, baseline_data: Dict[str, List[float]], current_data: Dict[str, List[float]]) -> Dict[str, Any]:
        results = []
        max_psi = 0.0

        for feat, curr_vals in current_data.items():
            base_vals = baseline_data.get(feat, [])
            if not base_vals or not curr_vals:
                continue

            arr_base = np.array(base_vals, dtype=float)
            arr_curr = np.array(curr_vals, dtype=float)

            psi = cls.calculate_psi(arr_base, arr_curr)
            ks_res = ks_2samp(arr_base, arr_curr)

            if psi < 0.1:
                severity = "LOW"
            elif psi < 0.2:
                severity = "MEDIUM"
            elif psi < 0.25:
                severity = "HIGH"
            else:
                severity = "CRITICAL"

            if psi > max_psi:
                max_psi = psi

            results.append({
                "feature": feat,
                "drift_score": round(psi, 4),
                "p_value": round(float(ks_res.pvalue), 4),
                "severity": severity,
                "baseline_mean": round(float(np.mean(arr_base)), 2),
                "current_mean": round(float(np.mean(arr_curr)), 2)
            })

        if max_psi < 0.1:
            overall_sev = "LOW"
        elif max_psi < 0.2:
            overall_sev = "MEDIUM"
        elif max_psi < 0.25:
            overall_sev = "HIGH"
        else:
            overall_sev = "CRITICAL"

        return {
            "overall_drift_score": round(max_psi, 4),
            "overall_severity": overall_sev,
            "features": results,
            "detected_at": datetime.utcnow().isoformat() + "Z"
        }

drift_service = DriftService()
