import { Injectable } from '@angular/core';
import { LensInterface } from './lens.interface';

@Injectable({
  providedIn: 'root'
})
export class LensParserService {
  parseLensData(input: string): LensInterface {
    const cylinderRegex = /Cylinder\sfor\sthe\s(left|right)\seye\s=\s([\d.]+)/i;
    const baseCurveRegex = /Base\scurve\sfor\s(left|right)\seye\s=\s([\d.]+)/i;
    const diameterRegex = /Diameter\sfor\s(left|right)\seye\s=\s([\d.]+)/i;
    const lensMaterialRegex = /lens-material\sis\s(\w+)/i;

    const lensData: LensInterface = {
      left: { sphere: null, cylinder: null, axis: null, diameter: null, productNumber: null, addition: null },
      right: { sphere: null, cylinder: null, axis: null, diameter: null, productNumber: null, addition: null },
      pupilDistance: null,
      baseCurve: null,
      lensMaterial: null,
      errors: []
    };

    // Parse cylinder
    const leftCylinderMatch = cylinderRegex.exec(input);
    if (leftCylinderMatch && leftCylinderMatch[1].toLowerCase() === 'left') {
      lensData.left.cylinder = parseFloat(leftCylinderMatch[2]);
    }

    const rightCylinderMatch = cylinderRegex.exec(input);
    if (rightCylinderMatch && rightCylinderMatch[1].toLowerCase() === 'right') {
      lensData.right.cylinder = parseFloat(rightCylinderMatch[2]);
    }

    // Parse base curve
    const leftBaseCurveMatch = baseCurveRegex.exec(input);
    if (leftBaseCurveMatch && leftBaseCurveMatch[1].toLowerCase() === 'left') {
      lensData.baseCurve = parseFloat(leftBaseCurveMatch[2]);
    }

    // Parse diameter
    const leftDiameterMatch = diameterRegex.exec(input);
    if (leftDiameterMatch && leftDiameterMatch[1].toLowerCase() === 'left') {
      lensData.left.diameter = parseFloat(leftDiameterMatch[2]);
    }

    // Parse lens material
    const lensMaterialMatch = lensMaterialRegex.exec(input);
    if (lensMaterialMatch) {
      const material = lensMaterialMatch[1];
      if (['Polycarbonate', 'Mineral', 'Organic'].includes(material)) {
        lensData.lensMaterial = material;
      } else {
        lensData.errors.push(`Invalid lens material: ${material}`);
      }
    }

    // Add validation errors
    if (lensData.left.sphere === null) {
      lensData.errors.push('Left sphere is missing or invalid.');
    }
    if (lensData.right.sphere === null) {
      lensData.errors.push('Right sphere is missing or invalid.');
    }

    return lensData;
  }
}
