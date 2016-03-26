import GLBoost from './../globals';
import Mesh from './Mesh';
import Matrix44 from '../math/Matrix44'

export default class SkeletalMesh extends Mesh {
  constructor(geometry, material, jointName) {
    super(geometry, material, jointName);
    this._rootJointName = jointName;
    this._jointsHierarchy = null;
    this._inverseBindMatrices = [];
  }

  prepareForRender(existCamera_f, lights, renderPasses) {
    this.bakeTransformToGeometry();
    this.multiplyMatrix(Matrix44.identity());
    super.prepareForRender(existCamera_f, lights, renderPasses);
  }

  set jointsHierarchy(jointsHierarchy) {
    this._jointsHierarchy = jointsHierarchy;
  }

  get jointsHierarchy() {
    return this._jointsHierarchy;
  }

  get rootJointName() {
    return this._rootJointName;
  }

  set inverseBindMatrices(inverseBindMatrices) {
    this._inverseBindMatrices = inverseBindMatrices;
    this._geometry.setExtraDataForShader('jointN', (inverseBindMatrices.length < 4) ? 4 : inverseBindMatrices.length);
  }

  get inverseBindMatrices() {
    return this._inverseBindMatrices;
  }
}

GLBoost['SkeletalMesh'] = SkeletalMesh;
